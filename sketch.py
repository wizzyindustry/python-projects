import cv2

cam = cv2.VideoCapture(0)

while True:
    _, img = cam.read()
    if not _:
        break

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    sketch = cv2.Canny(gray, 50, 150)

    cv2.imshow("Sketch Cam", sketch)

    if cv2.waitKey(1) == 27:   # Esc to quit
        break

cam.release()
cv2.destroyAllWindows()