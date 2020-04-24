import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useLocation, useHistory } from "react-router-dom";

import { ReactComponent as CloseBtn } from "./assets/close.svg";

// Custom hook from react-router-dom
const useQuery = () => new URLSearchParams(useLocation().search);

// Generate random device number
const getRandomNum = () => Math.floor(Math.random() * (101 - 999) + 101);

const App = () => {
  const [modal, setModal] = useState(false);
  let history = useHistory();
  let query = useQuery().get("add");

  // Check for query params on load
  useEffect(() => {
    if (query) {
      setModal(true);
    }
  }, [query]);

  return (
    <div className="app">
      <div className="phone">
        <div className="centerpiece">
          <h1>react-add-device</h1>
          <p>
            The demo works by checking for a query param. If it detects the
            query param then it will pop up a modal to walk you through the
            process. If you click the start button below, it will refresh the
            page with a query param in the url.
          </p>
          <button
            className="button"
            onClick={() => history.push(`/?add=device${getRandomNum()}`)}
          >
            Start
          </button>
        </div>
      </div>
      {modal && <Modal setModal={setModal} device={query} />}
    </div>
  );
};

const Modal = ({ setModal, device }) => {
  const [activeScreen, setActiveScreen] = useState("add");
  let history = useHistory();

  // Ignore touch events inside modal, but close on events from bg
  const closeFromBg = (e) => e.target === e.currentTarget && setModal(false);

  const screens = [
    {
      screen: "add",
      closeable: true,
      header: "Add New Device",
      description: `Would you like to add ${device} to your account?`,
      icon: "icon.png",
      buttonText: "Continue",
      callback: () => setActiveScreen("finish"),
    },
    {
      screen: "finish",
      closeable: false,
      header: "Device Added",
      description: `${device} has been added to your account!`,
      icon: "finish.png",
      buttonText: "Done",
      callback: () => {
        // Close modal
        setModal(false);

        // Redirect to home with query
        history.push("/");
      },
    },
  ];

  const Screen = ({ props }) => {
    return (
      <div className="screen">
        <div className="screen-contents">
          {props.closeable && (
            <button className="close-button">
              <CloseBtn onClick={() => setModal(false)} />
            </button>
          )}
          <div className="modal-header">
            <h1>{props.header}</h1>
            <p>{props.description}</p>
          </div>
          <div className="modal-content">
            <p>{props.icon}</p>
            <button className="button" onClick={props.callback}>
              {props.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-bg">
      <div className="modal-flex" onClick={closeFromBg}>
        <div className="modal-shell" onClick={closeFromBg}>
          <div className="modal">
            {screens.map((obj, i) => (
              <CSSTransition
                in={activeScreen === obj.screen}
                unmountOnExit
                timeout={150}
                classNames="screen-primary"
                key={i}
              >
                <Screen props={obj} />
              </CSSTransition>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
