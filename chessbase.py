"""
this module contains the board setup function and board draw function
running this module on its own plays a game of standard chess
"""

# the board Array which will hold our piece information
board = []
# the subsurface array for our chess piece images
piece_sheet = None
# a lookup list for chess piece names
piece_names = ['king','queen','bishop','rook','knight','pawn']