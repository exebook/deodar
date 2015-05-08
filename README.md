Деодар
======

Классическая двухпанельная рабочая среда (коммандер) для О.С. Линукс.

![Деодар][скриншот]

Наследует идеи Norton Commander, Volkov Commander, Dos Navigator, Far Manager.

Основан на технологиях Node.js, XLib, OpenGL, Freetype.

Имеет две панели, строку ввода, консоль совместимую с color-xterm удобно соединёные друг с другом в единое целое.

Имеет встроенные просмотрщик и правщик (редактор) знаковых файлов. Правщик оборудован для правки исходных кодов.

Изначально имеет русско-язычный внешний вид (пользовательский интерфейс).

Легко настраиваем и расширяем поскольку большая часть кода написана на JavaScript, можно подключать расширения npm, а на данный момент это более 50,000 расширений. 

Опирается на библиотеку Интервидение (Intervision) - напоминающую TurboVision. Интервидение поддерживает пользовательский ввод-вывод, как знакового отображения так и точечного.

Полностью поддерживает Юникодный ввод с клавиатуры, исходные файлы в UTF-8.

[Как установить из исходников](https://github.com/exebook/deodar/blob/master/%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0.%D0%B1%D1%83%D0%BA%D0%B2)

## Быстрая установка / Quick start (Ubuntu/Debian)
```sh
sudo apt-get install nodejs-legacy npm libx11-dev libxcursor-dev mesa-common-dev libfreetype6-dev libgl1-mesa-dev libv8-3.14-dev
npm install deodar
DISPLAY=:0.0 node node_modules/deodar/deodar.js
```

[скриншот]: https://raw.github.com/exebook/deodar/master/picture/peek.png

