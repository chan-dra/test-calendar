import React, { Component } from "react";
import "./App.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const titleData = [
  {
    id: "ee3c0801-9609-49ea-87fa-fcb9b9f438b9",
    launch_date: "2019-04-28 00:00:00",
    title: "Black Is The New Orange: Season 1"
  },
  {
    id: "01ddcfb6-9be0-4d99-a6e3-6b17ee37ac97",
    launch_date: "2018-01-14 00:00:00",
    title: "Black Is The New Orange: Season 2"
  },
  {
    id: "6761271c-958f-49ef-bc1a-8f8022d24d11",
    launch_date: "2018-01-28 00:00:00",
    title: "Cathunter: Season 2"
  },
  {
    id: "8761273c-958f-49ef-bc1a-9f8022d24d11",
    launch_date: "2018-02-06 00:00:00",
    title: "Black Is The New Orange: Season 3"
  },
  {
    id: "1761253c-958f-49ef-bc1a-9f6022d24d11",
    launch_date: "2018-02-06 12:00:00",
    title: "Planet Mars: Season 1"
  },
  {
    id: "789f7d37-b43d-4fd0-b169-6745cd103d25",
    launch_date: "2018-03-14 00:00:00",
    title: "Strangest Things: Season 1"
  },
  {
    id: "8fa94004-414f-4eed-bb0e-45a2b10ebebf",
    launch_date: "2018-05-27 00:00:00",
    title: "Strangest Things: Season 2"
  },
  {
    id: "0d413a7a-b776-44d5-9235-19602346f94a",
    launch_date: "2018-06-12 00:00:00",
    title: "House of Cats: Season 1"
  },
  {
    id: "65a208a5-768b-4677-838f-33c4dd385f9f",
    launch_date: "2018-07-01 00:00:00",
    title: "House of Cats: Season 2"
  },
  {
    id: "585a9285-d411-4625-a3f5-357f3e554673",
    launch_date: "2018-08-11 00:00:00",
    title: "Brighter"
  },
  {
    id: "3adad7b8-da99-4aba-b4f1-df43d3d9d7cf",
    launch_date: "2018-08-01 00:00:00",
    title: "Sandy Waxer"
  },
  {
    id: "e0986a67-d23a-415d-88d8-935de948ad16",
    launch_date: "2018-12-12 00:00:00",
    title: "Dave Chapel Stand-up Special"
  },
  {
    id: "5d3a0f27-d422-4629-ac5a-84732e248be5",
    launch_date: "2018-01-01 00:00:00",
    title: "The Adventures of Potato"
  }
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class App extends Component {
  state = {
    titles: {},
    loadingState: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };

  componentDidMount = () => {

    // reverse map to date for easier reading
    const titles = {};
    titleData.forEach(title => {
      const launchDate = new Date(title.launch_date);
      const formattedDate = this._getFormattedDate(
        launchDate.getFullYear(),
        launchDate.getMonth(),
        launchDate.getDate()
      );
      if (titles[formattedDate]) {
        titles[formattedDate].push(title);
      } else {
        titles[formattedDate] = [title];
      }
    });

    this.setState({
      titles
    });
  };

  render() {
    const { month, year, loadingState } = this.state;
    return (
      <div className="root">
        <div className="header">
          <button onClick={this._setPrev}>{"<-"}</button>
          {`${months[month]} ${year}`}
          <button onClick={this._setNext}>{"->"}</button>
        </div>
        <div className="dayContainer">
          {days.map((day, index) => (
            <div className="cell" key={index}>
              <strong>{day}</strong>
            </div>
          ))}
          {this._renderCalendarDays()}
        </div>
      </div>
    );
  }

  _renderCalendarDays = () => {
    const { month, year, titles } = this.state;

    const offsetDays = new Date(year, month, 1).getDay();
    const numDays = this._getDaysInMonth(year, month);
    const numRows = Math.ceil((offsetDays + numDays) / 7);

    const days = [];

    for (let i = 0; i < numRows * 7; i++) {
      const isPrevMonth = i < offsetDays;
      const isNextMonth = i >= offsetDays + numDays;
      let date = i - offsetDays + 1;
      let formattedDate = this._getFormattedDate(year, month, date);

      if (isPrevMonth) {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const numPrevMonthDays = this._getDaysInMonth(prevMonthYear, prevMonth);
        date = numPrevMonthDays + i - offsetDays + 1;
        formattedDate = this._getFormattedDate(prevMonthYear, prevMonth, date);
      } else if (isNextMonth) {
        date = i - offsetDays - numDays + 1;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextMonthYear = month === 11 ? year + 1 : year;
        formattedDate = this._getFormattedDate(nextMonthYear, nextMonth, date);
      }

      const isNotCurrentMonth = isPrevMonth || isNextMonth;
      const currentTitles = titles[formattedDate] || [];

      days.push(
        this._renderCalendarDay(i, date, isNotCurrentMonth, currentTitles)
      );
    }
    return days;
  };

  _renderCalendarDay = (index, date, isNotCurrentMonth, currentTitles) => {
    return (
      <div
        className={`cell day ${isNotCurrentMonth ? "notCurrentMonth" : ""}`}
        key={index}
      >
        {date}
        {currentTitles.map(title => (
          <div className="title" key={title.id} title={title.title}>
            {title.title}
          </div>
        ))}
      </div>
    );
  };

  _getFormattedDate = (year, month, day) => {
    return `${month}-${day}-${year}`;
  };

  _setNext = () => {
    const { month, year } = this.state;

    this.setState({
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year
    });
  };

  _setPrev = () => {
    const { month, year } = this.state;

    this.setState({
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year
    });
  };

  _getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
}

export default App;
