import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Autosuggest from 'react-autosuggest';
import  { useRef, useEffect } from 'react';



function BookingForm() {

  const cities = ["Agadir", "Casablanca", "Rabat", "Marakech", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
  const dailyRate = 50; // Example daily rate


  const [pickUpDate, setPickUpDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [pickUpOpen, setPickUpOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState(false);
  const [expiryOpen, setExpiryOpen] = useState(false);
  const [pickUpTime, setPickUpTime] = useState(null);
  const [returnTime, setReturnTime] = useState(null);
  const [selectedAssurances, setSelectedAssurances] = useState([]);
  const [selectedEnhancements, setSelectedEnhancements] = useState([]);

  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);


  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = (date, type) => {
    let startDate = pickUpDate;
    let endDate = returnDate;

    if (type === 'pickUp') startDate = date;
    if (type === 'return') endDate = date;

    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
      setTotalPrice(diffDays * dailyRate);
    }
  };

  const assurances = [
    { name: "Standard Insurance", price: 10 },
    { name: "Premium Insurance", price: 20 },
    { name: "No Insurance", price: 0 },
  ];

  const enhancements = [
    { name: "GPS Navigation Device", price: 5 },
    { name: "Booster Seat", price: 3 },
    { name: "Baby Car Seat", price: 4 },
  ];
  

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : cities.filter(city =>
      city.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => (
    <div>{suggestion}</div>
  );

  const handleTimeChange = (time, type) => {
    if (type === "pickUp") setPickUpTime(time);
    if (type === "return") setReturnTime(time);
  };
  const handleDateChange = (date, dateType) => {
    if (dateType === "pickUp") {
      setPickUpDate(date);
      setPickUpOpen(false);
    } else if (dateType === "return") {
      setReturnDate(date);
      setReturnOpen(false);
    } else if (dateType === "expiry") {
      setExpiryDate(date);
      setExpiryOpen(false);
    }
  };

  const handleAssuranceClick = (assurance) => {
    setSelectedAssurances(prevAssurances => {
      if (prevAssurances.includes(assurance)) {
        return prevAssurances.filter(a => a !== assurance);
      } else {
        return [...prevAssurances, assurance];
      }
    });
  };

  const handleEnhancementClick = (enhancement) => {
    setSelectedEnhancements(prevEnhancements => {
      const exists = prevEnhancements.find(e => e.name === enhancement.name);
      if (exists) {
        return prevEnhancements.filter(e => e.name !== enhancement.name);
      } else {
        return [...prevEnhancements, enhancement];
      }
    });
    calculateTotalPrice();
  };


  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % 5);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + 5) % 5);
    console.log(currentSlide)
  };
 

  return (
    <div className="wrapper">
      <div className="main">
        <div id="header">
          <h2>Book Now</h2>
          <p>Required fields are followed by *</p>
        </div>
        <div id="divider"></div>
        <div className="form">
          <div className="carousel">
            <div
              className="carousel-inner"
              style={{
                transform: `translateX(${currentSlide * -100}%)`,
              }}
            >
              <div className="item">
                <div className="date margin">
                  <label htmlFor="pickUp">Pick-Up date</label>
                  <div className="date-picker-container" id="pickUp">
                    <button
                      className="select-button"
                      onClick={() => setPickUpOpen(!pickUpOpen)}
                    >
                      {pickUpDate
                        ? pickUpDate.toLocaleDateString()
                        : "Select Date"}
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/plumpy/24/calendar--v1.png"
                        alt="calendar--v1"
                      />
                    </button>
                    {pickUpOpen && (
                      <div className="date-picker">
                        <DatePicker
                          selected={pickUpDate}
                          onChange={(date) => handleDateChange(date, "pickUp")}
                          onClickOutside={() => setPickUpOpen(false)}
                          inline
                        />
                      </div>
                    )}
                  </div>


                  <div className="time-picker-container">
                    <label htmlFor="pickUpTime">Pick-Up time</label>
                    <DatePicker
                      selected={pickUpTime}
                      onChange={(time) => handleTimeChange(time, "pickUp")}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      placeholderText="Select Time"
                    />
                  </div>
                </div>
                <div className="date margin">
                  <label htmlFor="return">Return date</label>
                  <div className="date-picker-container" id="return">
                    <button
                      className="select-button"
                      onClick={() => setReturnOpen(!returnOpen)}
                    >
                      {returnDate
                        ? returnDate.toLocaleDateString()
                        : "Select Date"}
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/plumpy/24/calendar--v1.png"
                        alt="calendar--v1"
                      />
                    </button>
                    {returnOpen && (
                      <div className="date-picker">
                        <DatePicker
                          selected={returnDate}
                          onChange={(date) => handleDateChange(date, "return")}
                          onClickOutside={() => setReturnOpen(false)}
                          inline
                        />
                      </div>
                    )}
                  </div>
                  <label htmlFor="returnTime">Return time</label>
                  <DatePicker
                    selected={returnTime}
                    onChange={(time) => handleTimeChange(time, "return")}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select Time"
                  />
                </div>
                <div className="date margin">
                  <label>City</label>
                  <div >
                    <Autosuggest
                      suggestions={suggestions}
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSuggestionsClearRequested}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={{
                        placeholder: 'Enter a city',
                        value: city,
                        onChange: (event, { newValue }) => setCity(newValue)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="item center">
                <div className="car-container">
                  <img src="https://image.elite-auto.fr//visuel/BMW/bmw_23x1msport23d4wdsu3b_angularfront.png" alt="Car" className="car-image" />
                  <div className="total-price">
                    <h3>Price for 4 days ${totalPrice}</h3>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="date margin">
                  <label htmlFor="pickUp">Car assurance</label>
                  <div className="date-picker-container" id="pickUp">
                    <div className="assurance-container">
                      <div
                        className={`assurance-option ${selectedAssurances.includes('Standard Insurance') ? 'selected' : ''}`}
                        onClick={() => handleAssuranceClick('Standard Insurance')}
                      >
                        Standard Insurance
                      </div>
                      <div
                        className={`assurance-option ${selectedAssurances.includes('Premium Insurance') ? 'selected' : ''}`}
                        onClick={() => handleAssuranceClick('Premium Insurance')}
                      >
                        Premium Insurance
                      </div>
                      <div
                        className={`assurance-option ${selectedAssurances.includes('No Insurance') ? 'selected' : ''}`}
                        onClick={() => handleAssuranceClick('No Insurance')}
                      >
                        No Insurance
                      </div>
                    </div>
                  </div>
                </div>

                <div className="date margin">
                  <label htmlFor="pickUp">Trip Enhancements</label>
                  <div className="date-picker-container" id="pickUp">
                    <div className="assurance-container">
                      <div
                        className={`assurance-option ${selectedAssurances.includes('GPS Navigation Device') ? 'selected' : ''}`}
                        onClick={() => handleAssuranceClick('GPS Navigation Device')}
                      >
                        GPS Navigation Device
                      </div>
                      <div
                        className={`assurance-option ${selectedAssurances.includes('Booster Seat') ? 'selected' : ''}`}
                        onClick={() => handleAssuranceClick('Booster Seat')}
                      >
                        Booster Seat
                      </div>
                      <div
                        className={`assurance-option ${selectedAssurances.includes('Baby Car Seat') ? 'selected' : ''}`}
                        onClick={() => handleAssuranceClick('Baby Car Seat')}
                      >
                        Baby Car Seat
                      </div>
                    </div>
                  </div>
                </div>

              </div>


              <div className="item">
                {/* Pick up dates */}
                <div className="age margin">
                  <label
                    htmlFor="age"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="age"
                    aria-describedby="helper-text-explanation"
                    placeholder="John "
                  />
                </div>
                {/* Return dates */}
                <div className="age margin">
                  <label
                    htmlFor="age"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="age"
                    aria-describedby="helper-text-explanation"
                    placeholder="Doe"
                  />
                </div>
                {/* Age */}
                <div className="age margin">
                  <label
                    htmlFor="age"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="age"
                    aria-describedby="helper-text-explanation"
                    placeholder="Phone Number"
                  />
                </div>
                {/* children */}
                <div className="children margin">
                  <label
                    htmlFor="children"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Gender
                  </label>
                  <select
                    id="children"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option value="0">
                      Select your Gender
                    </option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Rather not say</option>
                  </select>
                </div>
                <div className="children margin">
                  <label
                    htmlFor="children"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Age
                  </label>
                  <select
                    id="children"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option value="0">
                      Select your Age
                    </option>
                    <option value="1"> - 20 y</option>
                    <option value="2"> + 20 y</option>
                    <option value="3">+ 30 y</option>
                  </select>
                </div>

                <div className="upload margin">
        <label
          htmlFor="identityUpload"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Upload Identity
        </label>
        <input
          type="file"
          id="identityUpload"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          aria-describedby="identityUpload_help"
        />
        <p id="identityUpload_help" className="mt-1 text-sm text-gray-500">
          Please, Upload a scanned copy of your identity document.
        </p>
      </div>
              </div>

              <div className="item">

              </div>

            </div>
          </div>
          <div className="btns margin">
            <button onClick={handlePrev} disabled={currentSlide === 0}>Previous</button>
            <button className="next" onClick={handleNext} disabled={currentSlide === 2}>
              Next
            </button>
          </div>
        </div>
      </div>
      {/* <div className="carousel">
        <div
          className="carousel-inner"
          style={{
            transform: `translateX(${currentSlide * -100}%)`,
          }}
        >
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </div>
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
      </div> */}
      {/* 
      <div className="main">
        <div id="header">
          <h2>Book Now</h2>
          <p>Required fields are followed by *</p>
        </div>
        <div id="divider"></div>
        <div className="form">
          <div className="btns margin">
            <button onClick={goToPrevSlide}>Previous</button>
            <button className="next" onClick={goToNextSlide}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="main">
        <div id="header">
          <h2>Book Now</h2>
          <p>Required fields are followed by *</p>
        </div>
        <div id="divider"></div>
        <div className="form">
          <div className="btns margin">
            <button onClick={goToPrevSlide}>Previous</button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default BookingForm;
