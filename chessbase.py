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

def setup():
    """
    A function that sets up the chess board
    can and should be called multiple times
    sets the global board to an 8x8 list of either none or piece names
    """

def load_pieces():
    """
    this function slices the chess set into pygame subsurfaces
    only reads and slices the image once
    sets the gloabal piece_set variable
    """