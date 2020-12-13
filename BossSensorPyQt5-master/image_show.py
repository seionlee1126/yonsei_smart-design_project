# -*- coding: utf-8 -*-
import sys

from PyQt5 import QtGui, QtCore
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QPushButton


def show_image(image_path='s_pycharm.jpg'):
    app = QApplication(sys.argv)
    pixmap = QtGui.QPixmap(image_path)
    screen = QLabel()
    screen.setPixmap(pixmap)
    screen.showFullScreen()
    sys.exit(app.exec_())


if __name__ == '__main__':
    show_image()
