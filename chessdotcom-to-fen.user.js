// ==UserScript==
// @name            Chess Engine
// @author          msaba92
// @namespace       chess-engine
// @description     Use a chess engine to cheat at chess
// @version	        0.1
// @include         *://*.chess.com/play/computer
// @include         *://*.chess.com/live*
// @run-at          document-end
// ==/UserScript==

function starter(element, method) {
    if (typeof window[method] === "undefined") {
        window[method] = setInterval(function() {
            if (document.querySelectorAll(element).length) {
                clearInterval(window[method])
                return method();
            }
        }, 1000);
    }
}


function generatePosition () {
    let board = window.getComputedStyle(document.querySelector(".chessboard"))
    let board_size = parseInt(board.height);

    let notation_arrays = [];
    for (let i = 0; i < 8; i++) {
        line = Array.apply(null, Array(8)).map(Number.prototype.valueOf, 0);
        notation_arrays.push(line);
    }

    piecesArray = document.querySelectorAll(".chess_com_draggable")
    for (let i = 0; i < piecesArray.length; i++) {
        let position_matrix = window.getComputedStyle(piecesArray[i]).transform;
		if (position_matrix === "none") {
			continue
        }

        let piece_type = piecesArray[i]["src"].split("/").pop().split(".")[0];

        if (piece_type.startsWith("b")) {
            piece_type = piece_type[1];
        } else if (piece_type.startsWith("w")) {
            piece_type = piece_type[1].toUpperCase();
        } else {
			continue
        }
        let position_relative = position_matrix.split("(")[1].split(")")[0].split(",").slice(4);
        ver = Number(position_relative[0]) / (board_size / 8);
        hor = Number(position_relative[1]) / (board_size / 8);
        notation_arrays[hor][ver] = piece_type;
    }

    let notation_string = "";
    for (let i = 0; i < notation_arrays.length; i++) {
        let zeros = 0;
        for (let j = 0; j < notation_arrays[i].length; j++) {
            if (notation_arrays[i][j] === 0) {
                zeros += 1;
            } else {
                notation_string += (zeros ? zeros : "") + notation_arrays[i][j];
                zeros = 0;
            }
            if (j === 7) {
                if (zeros === 8) {
                    notation_string += zeros;
                }
                if (i !== 7) {
                    notation_string += "/";
                }
            }
        }
    }
    return notation_string;
}


console.log(starter(".chess_com_draggable", Draw));
