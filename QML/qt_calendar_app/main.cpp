#include <QApplication>
#include <QCalendarWidget>
#include <QMainWindow>
#include <QVBoxLayout>
#include <QWidget>

int main(int argc, char *argv[]) {
    setAppId("QTCalendar");
    QApplication app(argc, argv);

    QMainWindow window;
    window.setWindowTitle("Qt Calendar");

    QCalendarWidget *calendar = new QCalendarWidget();
    calendar->setMinimumSize(400, 300);

    QWidget *centralWidget = new QWidget();
    QVBoxLayout *layout = new QVBoxLayout(centralWidget);
    layout->addWidget(calendar);
    window.setCentralWidget(centralWidget);

    window.show();

    return app.exec();
}
