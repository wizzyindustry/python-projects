#python program on creating a snake game


import pygame
import random 


pygame.init()
w = 400
screen = pygame.display.set_mode((w.w))
clock = pygame.time.clock()

snake = [(200,200)]
direction = (20,0)
food = (random.randrange(0,w,20),random.randrange(0,w,20))

running = True
while running:
    clock.tick(10)
    for event in pygame.event.get():
        if event.type == pygame.QUIT():
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:direction = (0,-20)
            if event.key == pygame.K_DOWN:direction = (0,20)
            if event.key == pygame.K_LEFT:direction = (-20,0)
            if event.key == pygame.K_RIGHT:direction = (20,0)
    head = (snake[0][0]+direction[0],snake[0,1]+direction[1])
    snake.insert(0,head)

    if head == food:
        food=(random.randrange(0,w,20),random.randrange(0,w,20))
    else:
        snake.pop()
    
    if(head[0]<0 or head[0]>=w or head[1]<0 or head[1]>=w or head in snake[1:]):
        running = False
    
    screen.fill((20,20,20))
    for s in snake:
        pygame.draw.rect(screen,(0,255,100),(*s,20,20))
    pygame.draw.rect(screen,(255,50,50),(*food,20,20))

    pygame.display.flip()

pygame.quit()
