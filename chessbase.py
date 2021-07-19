"""
this module contains the board setup function and board draw function
running this module on its own plays a game of standard chess
"""
import pygame

# the board Array which will hold our piece information
board = []
# the subsurface array for our chess piece images
piece_sheet = None
# a lookup list for chess piece names
piece_names = ['king','queen','bishop','knight','rook','pawn']
# a global size contoll variable
size = 0

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
    global piece_sheet, size
    if piece_sheet is None:
        image  = pygame.image.load("1920px-Chess_Pieces_Sprite.png")
        im_width,im_height = image.get_size()
        # because our set is 2 rows and that our set is full of square sprites
        size = im_height // 2
        # setting our gloabl piecesheet
        piece_sheet = []
        for color in range(2):
            # white is 0, black is 1
            pset = []
            for piece in range(im_width//size):
                rect = (piece*size,color*size,size,size)
                set.append(image.subsurface(rect))
            piece_sheet.append(pset)

if __name__ == "__main__":
    # starting pygame
    pygame.init()

    #prepping a loop control variable
    playing = True

    # setting up the screen
    # using 8x12 for dead piece display
    screen = pygame.display.set_mode((size*8,size*12))

    # loading our sprites
    load_pieces()

    while playing:
        # our event queue
        for event in pygame.event.get():
            # checking the event queue
            # Handling mouse clicks
            # checking if we have our exit event
            playing = (event.type != pygame.QUIT)
        if not playing: break

        # checking for check/mate

        # rendering:
        # set background color
        # fill out board
        # show the pieces
        # show overlay lines
        # such as where the piece being hovered over can go
        # or which pieces are pressing check/mate

        # just using this here for testing
        for x in range(2):
            for y in range(len(piece_sheet[0])):
                screen.blit(piece_sheet[x][y],(x*size,y*size))