// Variables
const figures = document.querySelectorAll('.figure'),
    body = document.querySelector('body'),
    blocks = document.querySelectorAll('.block'),
    rowsArray = ['a','b','c','d','e','f','g','h'],
    figuresArray = ['king','queen','rook','pawn','elephant','horse'],
    allFunctions = {
        king: (data, target) => generateFunctionsForKing(data, target),
        queen: (data, target) => generateFunctionsForQueen(data, target),
        rook: (data, target) => generateFunctionsForRook(data, target),
        pawn: (data, target) => generateFunctionsForPawn(data, target),
        elephant: (data, target) => generateFunctionsForElephant(data, target),
        horse: (data, target) => generateFunctionsForHorse(data, target),
};
// Actions
document.addEventListener("DOMContentLoaded",function () {
    document.querySelectorAll('.figure[data-side="black"]').forEach(item => changeClassOfItem(item,'hold'))
    chessMainFunction()
    documentActions()
})
// Main functions
function documentActions() {
    document.addEventListener('click',(e) => {
        const target = e.target
        if(body.classList.contains('game')) {
            figureMoveToOtherBlock(target)
        }
    })
}
function chessMainFunction() {
    figures.forEach(figure => {
        figure.addEventListener('click',() => {
            setHoldClasses()
            changeClassOfItem(figure,'hold',false)
            changeClassOfItem(figure,'active')
            const data = getDataOfFigure(figure)
            generateAllPossibleMoves(data,figure)
            changeClassOfItem(body,'game')
            changeClassOfItem(figure.closest('.block'),'back')
        })
    })
}








// ////////////////////// Functions
function getDataOfFigure(item) {
    return {
        type : item.getAttribute('data-type'),
        side : item.getAttribute('data-side'),
        row : item.closest('.row').getAttribute('data-row'),
        order : item.closest('.block').getAttribute('data-order')
    }
}
function changeClassOfItem(item,className,type = true) {
    let action = type ? 'add' : 'remove'
    item.classList[action](className);
}
function setHoldClasses() {
    figures.forEach(item => {
        item.classList.remove('active')
        item.classList.add('hold')
    })
}

function generateAllPossibleMoves(data,target) {
    let allMoves = allFunctions[data.type](data, target),
        possibleMoves = allMoves['possible'],
        attackMoves = allMoves['attack']
    possibleMoves.forEach(item => item.classList.add('possible'))
    attackMoves.forEach(item => item.classList.add('danger'))
}








function renderArrayToDomList (array) {
    let newArray = []
    array.forEach(move => {
        let parts = move.split('-'),
            row = parts[0],
            order = parts[1],
            currentBlock = document.querySelector(`.row[data-row="${row}"] .block[data-order="${order}"]`)
            newArray.push(currentBlock)
    })
    return newArray
}

function checkIfBlockIsEmpty(array,type = true,side = false) {
    let newArray = []
    for(let i = 0; i < array.length;i++) {
        let item = array[i]
        if(!item) {
            continue
        }
        let otherFigure = item.querySelector('.figure')

        if(type) {
            if(otherFigure) {
                break
            } else {
                newArray.push(item)
            }
        } else {
            if(otherFigure && otherFigure.getAttribute('data-side') !== side) {
                newArray.push(item)
            }
        }
        
    }
    return newArray
}

function getNeighborsRowNumbers(row) {
    let index = null
    rowsArray.forEach((element,ind) => {
        if(element === row) {
            index = ind
        }
    });
    
    return {
        prev: rowsArray[index - 1],
        next: rowsArray[index + 1]
    }
}
// All vertical and horisontal moves
function getHorisontaAndVerticalMovesArray(row,order,side) {
    let moves = [],
    intOrder = parseInt(order),
    attackArray = [],
    currentIndex = rowsArray.indexOf(row),
    rulesArray = [
        {   type : true,
            rowOrder: currentIndex,
            step : 1,
            updateOrder: intOrder,
            vertical: true
        },
        {
            type : false,
            rowOrder: currentIndex,
            step : 1,
            updateOrder: intOrder,
            vertical: true
        },
        {
            type : true,
            rowOrder: currentIndex + 1,
            step : 1,
            updateOrder: intOrder,
            vertical: false
        },
        {
            type : true,
            rowOrder: currentIndex - 1,
            step : -1,
            updateOrder: intOrder,
            vertical: false
        },
    ]
    rulesArray.forEach(rule => {
        
        let updateOrder  = rule.updateOrder,
            vertical = rule.vertical
        for (let i = rule.vertical ? rule.updateOrder : rule.rowOrder; rule.type ? i < 8 : i >= 0; i += rule.step) {
            if(vertical) {
                rule.type ? updateOrder++ : updateOrder--
            } else {
                updateOrder = updateOrder
            }
            
            let rowValue =  vertical ? row : rowsArray[i],
                domItem = document.querySelector(`.row[data-row="${rowValue}"] .block[data-order="${updateOrder}"]`)
            if(!domItem) {
                break;
            }
            itemFigure = domItem.querySelector('.figure') 
            if(itemFigure) {
                let checkSide = itemFigure.getAttribute('data-side')
                if(checkSide !== side) {
                    attackArray.push(domItem)
                }
                break
            } else {
                moves.push(domItem)
            }
        }
    })
    
    return {
        possible : moves,
        attack : attackArray,
    }
}
// All diagonal moves
function getDiagonalMovesArray(row,order,side) {
    let moves = [],
    intOrder = parseInt(order),
    attackArray = [],
    currentIndex = rowsArray.indexOf(row),
    rulesArray = [
        {   type : true,
            rowOrder: currentIndex + 1,
            step : 1,
            updateOrder: intOrder
        },
        {
            type : false,
            rowOrder : currentIndex - 1,
            step : -1,
            updateOrder : intOrder
        },
        {
            type : false,
            rowOrder : currentIndex + 1,
            step : 1,
            updateOrder : intOrder 
        },
        {
            type : true,
            rowOrder : currentIndex  - 1,
            step : -1,
            updateOrder : intOrder
        },
    ]
    rulesArray.forEach(rule => {
        
        let updateOrder  = rule.updateOrder
        for (let i = rule.rowOrder; rule.type ? i < 8 : i >= 0; i += rule.step) {
            rule.type ? updateOrder++ : updateOrder--
            let rowValue = rowsArray[i],
                domItem = document.querySelector(`.row[data-row="${rowValue}"] .block[data-order="${updateOrder}"]`)
            if(!domItem) {
                break;
            }
            itemFigure = domItem.querySelector('.figure') 
            if(itemFigure) {
                let checkSide = itemFigure.getAttribute('data-side')
                if(checkSide !== side) {
                    attackArray.push(domItem)
                }
                break
            } else {
                moves.push(domItem)
            }
        }
    })
    
    return {
        possible : moves,
        attack : attackArray,
    }
}
// All moves for horse
function getAllMovesForHorse(row,order,side) {
    let moves = [],
        intOrder = parseInt(order),
        attackArray = [],
        rowIndex = rowsArray.indexOf(row),
        rules = [
            {
                row : rowIndex + 1,
                newOrder : intOrder + 2
            },
            {
                row : rowIndex - 1,
                newOrder : intOrder + 2
            },
            {
                row : rowIndex - 2,
                newOrder : intOrder + 1
            },
            {
                row : rowIndex + 2,
                newOrder : intOrder + 1
            },
            {
                row : rowIndex - 2,
                newOrder : intOrder - 1
            },
            {
                row : rowIndex + 2,
                newOrder : intOrder - 1
            },
            {
                row : rowIndex + 1,
                newOrder : intOrder - 2
            },
            {
                row : rowIndex - 1,
                newOrder : intOrder - 2
            }
        ]
    rules.forEach(item => {
        let currentRow = rowsArray[item.row],
            currentOrder = item.newOrder,
            currentBlock = document.querySelector(`.row[data-row="${currentRow}"] .block[data-order="${currentOrder}"]`)
            if(!currentBlock) {
                return
            }
            let figure = currentBlock.querySelector('.figure')
            if(figure) {
                let figureSide = figure.getAttribute('data-side')
                if(figureSide !== side) {
                    attackArray.push(currentBlock)
                } else {
                    return
                }
            }
            moves.push(currentBlock)
    })
    
    return {
        possible : moves,
        attack : attackArray,
    }
}
function getAllMovesForKing(row,order,side) {
    let moves = [],
        // shah = checkKingNextItemForSafety(side),
        intOrder = parseInt(order),
        attackArray = [],
        rowIndex = rowsArray.indexOf(row),
        rules = [
            {
                row : rowIndex,
                newOrder : intOrder + 1
            },
            {
                row : rowIndex,
                newOrder : intOrder - 1
            },
            {
                row : rowIndex - 1,
                newOrder : intOrder
            },
            {
                row : rowIndex + 1,
                newOrder : intOrder
            },
            {
                row : rowIndex - 1,
                newOrder : intOrder + 1
            },
            {
                row : rowIndex + 1,
                newOrder : intOrder + 1
            },
            {
                row : rowIndex - 1,
                newOrder : intOrder - 1
            },
            {
                row : rowIndex + 1,
                newOrder : intOrder - 1
            },
        ]
    // console.log(shah);
    rules.forEach(item => {
        let currentRow = rowsArray[item.row],
            currentOrder = item.newOrder,
            currentBlock = document.querySelector(`.row[data-row="${currentRow}"] .block[data-order="${currentOrder}"]`)
            if(!currentBlock) {
                return
            }
            let figure = currentBlock.querySelector('.figure')
            if(figure) {
                let figureSide = figure.getAttribute('data-side')
                if(figureSide !== side) {
                    attackArray.push(currentBlock)
                } else {
                    return
                }
            }
            moves.push(currentBlock)
    })
    
    return {
        possible : moves,
        attack : attackArray,
    }
}
function checkKingNextItemForSafety(side) {
    let oponentsMoves = [],
        oponentSide = side === 'white' ? 'black' : 'white',
        allFigures = document.querySelectorAll(`.figure[data-side="${oponentSide}"]`)
    allFigures.forEach(figure => {
        const data = getDataOfFigure(figure),
            allMoves = allFunctions[data.type](data, figure)
            oponentsMoves.push(allMoves)
    })
    return oponentsMoves
}
////////////////// Moving elems//////////////////////////////////////

function figureMoveToOtherBlock(target) {
    let activeFigure = document.querySelector('.figure.active') 
    if((!activeFigure || !target.classList.contains('possible')) && (!activeFigure || !target.classList.contains('danger')) && (!activeFigure || !target.classList.contains('back'))) {
        return
    }
    let opponent =  activeFigure.getAttribute('data-side') === 'white' ? 'black' : 'white',
        opponentFigures = document.querySelectorAll(`.figure[data-side="${opponent}"]`),
        currentFigures = document.querySelectorAll(`.figure[data-side="${activeFigure.getAttribute('data-side')}"]`)
    if(target.classList.contains('back')) {
        changeClassOfItem(activeFigure,'active',false)
        changeClassOfItem(target,'back',false)
        currentFigures.forEach(item => changeClassOfItem(item,'hold',false))
        blocks.forEach(item => changeClassOfItem(item,'possible',false))
        blocks.forEach(item => changeClassOfItem(item,'danger',false))
        return false
    }
    if(target.classList.contains('danger')) {
        let targetItem = target.querySelector('.figure'),
            targetSide = activeFigure.getAttribute('data-side'),
            busket = document.querySelector(`#${targetSide}-busket`)
            busket.append(targetItem)
    }
    target.append(activeFigure)
    changeClassOfItem(activeFigure,'active',false)
    if(!activeFigure.classList.contains('entered')) {
        changeClassOfItem(activeFigure,'entered')
    }
    opponentFigures.forEach(item => changeClassOfItem(item,'hold',false))
    currentFigures.forEach(item => changeClassOfItem(item,'hold'))
    blocks.forEach(item => changeClassOfItem(item,'possible',false))
    blocks.forEach(item => changeClassOfItem(item,'danger',false))
    blocks.forEach(item => changeClassOfItem(item,'back',false))
    changeClassOfItem(body,'game',false)
}


/////////////////////////// Getters///////////////////////////////

function generateFunctionsForPawn(data,target) {
    let check = target.classList.contains('entered') ? false : true,
        targetSide = target.getAttribute('data-side')
        moves = [],
        attack = [],
        movesFiltered = [],
        order = parseInt(data.order),
        operator = data.side === 'white' ? 1 : -1,
        neighborRows = getNeighborsRowNumbers(data.row)  
    moves.push(data.row + '-' + (order + operator * 1));
    attack.push(neighborRows.prev + '-' + (order + operator * 1));
    attack.push(neighborRows.next + '-' + (order + operator * 1));
    if(check) {
        moves.push(data.row + '-' + (order + operator * 2));
    }
    movesFiltered = renderArrayToDomList(moves)
    movesFiltered = checkIfBlockIsEmpty(movesFiltered)
    attackFiltered = renderArrayToDomList(attack)
    attackFiltered = checkIfBlockIsEmpty(attackFiltered,false,targetSide)
    
    return {
        possible : movesFiltered,
        attack : attackFiltered,
        current : target.closest('.block')
    }
}

function generateFunctionsForKing(data,target) {
    let check = target.classList.contains('entered') ? false : true,
    targetSide = data.side,
    allMoves = getAllMovesForKing(data.row,data.order,targetSide)
    return {
        possible : allMoves.possible,
        attack : allMoves.attack,
        current : target.closest('.block')
    }
}
function generateFunctionsForQueen(data,target) {
    let targetSide = data.side,
        diagonalMoves = getDiagonalMovesArray(data.row,data.order,targetSide),
        otherMoves = getHorisontaAndVerticalMovesArray(data.row,data.order,targetSide)
        moves = diagonalMoves.possible.concat(otherMoves.possible),
        attack = diagonalMoves.attack.concat(otherMoves.attack)
    return {
        possible : moves,
        attack : attack,
        current : target.closest('.block')
    }
}
function generateFunctionsForRook(data,target) {
    let targetSide = data.side,
        moves = getDiagonalMovesArray(data.row,data.order,targetSide)

    return {
        possible : moves.possible,
        attack : moves.attack,
        current : target.closest('.block')
    }
}
function generateFunctionsForElephant(data,target) {
    let check = target.classList.contains('entered') ? false : true,
        targetSide = data.side,
        allMoves = getHorisontaAndVerticalMovesArray(data.row,data.order,targetSide)
    return {
        possible : allMoves.possible,
        attack : allMoves.attack,
        current : target.closest('.block')
    }
}
function generateFunctionsForHorse(data,target) {
    let check = target.classList.contains('entered') ? false : true,
    targetSide = data.side,
    allMoves = getAllMovesForHorse(data.row,data.order,targetSide)
    return {
        possible : allMoves.possible,
        attack : allMoves.attack,
        current : target.closest('.block')
    }
}
