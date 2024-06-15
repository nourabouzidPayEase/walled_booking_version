import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
  TextField as Input,
} from "@mui/material";
import { CalendarToday, CreditCard } from "@mui/icons-material";
import PaymentForm from './PaymentForm';
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Autosuggest from 'react-autosuggest';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('--');

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

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % 4);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + 4) % 4);
    console.log(currentSlide)
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },

    onSubmit: async (values) => {
      // Implement payment logic here
      console.log("Processing payment...", values);
    },
  });

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Limit to four numeric characters
    const formattedValue = numericValue.slice(0, 4);

    // Add the '/' separator after the first two characters
    if (formattedValue.length > 2) {
      return formattedValue.slice(0, 2) + " / " + formattedValue.slice(2);
    } else {
      return formattedValue;
    }
  };



  return (
    <div className="wrapper">
      <div className="main">
        <div id="header">
          <h2>Book Now</h2>
          <p>Required fields are followed by *</p>
        </div>
        <div id="divider"></div>
        <div className="form border-red">
          <div className="carousel border-blue">
            <div
              className="carousel-inner"
              style={{
                transform: `translateX(${currentSlide * -100}%)`,
              }}
            >
              <div className="item ">
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
                      className=""
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
                <div className="date city-pick-container margin">
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

              <div className="item">
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
                <PaymentForm />
              </div>



            </div>
          </div>
          <div className="btns margin">
            <button onClick={handlePrev} disabled={currentSlide === 0}>
              Previous
            </button>
            <button
              className="next"
              onClick={handleNext}
              disabled={currentSlide === 3}
            >
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
