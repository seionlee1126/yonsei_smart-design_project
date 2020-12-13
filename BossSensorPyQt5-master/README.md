# BossSensor
Hide your screen when your boss is approaching.

## Demo
The boss stands up. He is approaching.

![standup](https://github.com/Hironsan/BossSensor/blob/master/resource_for_readme/standup.jpg)

When he is approaching, the program fetches face images and classifies the image.
 
![approaching](https://github.com/Hironsan/BossSensor/blob/master/resource_for_readme/approach.jpg)

If the image is classified as the Boss, it will monitor changes.

![editor](https://github.com/Hironsan/BossSensor/blob/master/resource_for_readme/editor.jpg)

## Requirements

* WebCamera
* Python3.5
* OSX
* Anaconda
* Lots of images of your boss and other person image

Put images into [data/boss](https://github.com/Hironsan/BossSensor/tree/master/data/boss) and [data/other](https://github.com/Hironsan/BossSensor/tree/master/data/other).

## Usage
First, Train boss image.

```
$ python boss_train.py
```


Second, start BossSensor. 

```
$ python camera_reader.py
```

## Install
Install OpenCV, PyQt4, Anaconda.

```
conda create -n venv python=3.5
source activate venv
conda install -c https://conda.anaconda.org/menpo opencv3
conda install -c conda-forge tensorflow
pip install -r requirements.txt
```

Change Keras backend from Theano to TensorFlow. 

## Licence

[MIT](https://github.com/Hironsan/BossSensor/blob/master/LICENSE)

## Author

[Hironsan](https://github.com/Hironsan)


------------------


# Modified Info

## Detail
Test the latest library operation.
Modified to work with PyQt5
최신 라이브러리 동작 테스트 완료.
PyQt5에서 작동하도록 수정 됨
最新のライブラリ動作テスト完了。
PyQt5で動作するように修正されました。

## Tested Enviorment
* macOS Sierra 10.12.3
* Macbook Pro 2016 Late 15inch
* Python 3.5
* iSight(Macbook Pro Included)
* OpenCV3
* Anaconda (miniconda3)
* PyQt5

## Usage
You can install and use the same as [Hironsan] (https://github.com/Hironsan).

[Hironsan](https://github.com/Hironsan)님의 원문과 동일하게 설치 및 사용이 가능합니다.

[Hironsan]（https://github.com/Hironsan）さんの原文と同じようにインストールして使用が可能です。


## Must Check and Edit Here!!! Tips
If you can not run, please be sure to modify the path below.

실행 할 수 없는 분은 아래의 경로를 반드시 수정하세요.

実行することができない方は、以下のパスを必ず変更してください。

`
in camera_reader.py : 
cascade_path = "/usr/local/opt/opencv/share/OpenCV/haarcascades/haarcascade_frontalface_default.xml"
`

Change To Your OpenCV Installed Dir. 

당신의 OpenCV 설치 디렉토리로 변경하십시오.

あなたのOpenCVインストールディレクトリに変更してください。

`
/usr/local/opt/opencv/share/OpenCV/haarcascades/ -> Your Dir. 당신의 Dir. あなたのDir.
`

## About face recognition performance
To improve face recognition performance, you need a lot of pictures to learn.
Though it is introduced in the original author's blog, it is necessary to acquire the understanding of the subject, and at least a few hundred sheets and a maximum of about 1,500 sheets of photographing images.

얼굴 인식 성능을 올리려면 학습할 때 아주 많은 사진이 필요합니다.
원작자의 블로그에서도 소개하고 있지만, 피사체의 양해를 구해 최소 몇백장 최대 1500장 가량의 다각도 촬영 이미지가 필요합니다.

顔認識の性能を上げるには、学習したときに、非常に多くの写真が必要になります。
原作者のブログでも紹介しているが、被写体の了解を求め、最小数百枚、最大1500枚ほどの多角撮影画像が必要になります。

## Modify by
[Kpaper](http://blog.kpaper.com/2017/02/bosssensor.html)
