# -*- coding:utf-8 -*-
import cv2

from boss_train import Model
from image_show import show_image

if __name__ == '__main__':
    cap = cv2.VideoCapture(0)
    cascade_path = "/usr/local/opt/opencv/share/OpenCV/haarcascades/haarcascade_frontalface_default.xml"

    model = Model()
    model.load()

    print("Face Detect Start!")

    while True:
        _, frame = cap.read()

        # グレースケール変換 // 그레이스케일 변환
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # カスケード分類器の特徴量を取得する // 캐스케이드 분류기의 특징량을 취득한다.
        cascade = cv2.CascadeClassifier(cascade_path)

        # 物体認識（顔認識）の実行 // 물체인식 (얼굴인식) 의 실행
        facerect = cascade.detectMultiScale(frame_gray, scaleFactor=1.2, minNeighbors=3, minSize=(10, 10))
        #facerect = cascade.detectMultiScale(frame_gray, scaleFactor=1.01, minNeighbors=3, minSize=(3, 3))

        if len(facerect) > 0:
            print('face detected')
            color = (255, 255, 255)  # 白 // 흰색
            for rect in facerect:
                # 検出した顔を囲む矩形の作成 // 검출 한 얼굴을 감싸는 사각형 만들기
                #cv2.rectangle(frame, tuple(rect[0:2]), tuple(rect[0:2] + rect[2:4]), color, thickness=2)

                x, y = rect[0:2]
                width, height = rect[2:4]
                image = frame[y - 10: y + height, x: x + width]

                result = model.predict(image)
                if result == 0:  # boss
                    print('Boss is approaching')
                    #show_image()

                else:
                    print('Not boss')
        
        else: # 얼굴을 찾지 못했을 때...
            print("Face Detecting...")

        #10msecキー入力待ち // 10msec 키 입력 대기
        k = cv2.waitKey(100)

        #Escキーを押されたら終了 // Esc키를 누르면 종료
        if k == 27:
            break


    #キャプチャを終了 // 캡쳐를 종료
    cap.release()
    cv2.destroyAllWindows()
