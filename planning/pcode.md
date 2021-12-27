# **Battleship**

The game of battleship played vs an AI.  

#### Page load
- Set up constants for player values
- Set up variables for turn, winner, board
- Cache each players board elements and any other needed items
- Set up event listeners for the board
- Set up functions
```
{
    const for players, boards, ships
    vars for turn, winner
    place begin button on board
    init on begin
    modify h1 to say place your ships
    render ships at bottom of screen and check where player clicks to position ships on board
    call function for computer to place it's own ships (and hide them on screen from player so all they see is an empty grid)
    update arrays for player and computer ship locations
    begin the first turn
    listen for player click location
    check for hit
    if hit change value of that pos in array and render a color in that square on the grid
    if hit sinks render ship for player to see and add message
    continue loop and call function to check for win (all ships sunk)
    render message when winner is determined and if cpu won render it's remaining ships
}
```

