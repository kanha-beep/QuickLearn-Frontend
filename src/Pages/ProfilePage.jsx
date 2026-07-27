import React, { useState } from "react";
import { motion } from "motion/react";

const menuItems = ["Home", "Profile", "Settings"];
const chatRows = [1, 2, 3];

export default function ProfilePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="ml-3">
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Profile Page</h1>
      <div className="grid h-[40rem] grid-cols-12 gap-4">
        {/* 1st div navbar left side */}
        <div className="col-1 border rounded" style={{margin:"0 -2rem"}}>
          {/* toggle button */}
          <button
            className="btn btn-outline-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#sideNav"
          >
            ☰
          </button>

          {/* offcanvas navbar */}
          <div className="offcanvas offcanvas-start" tabIndex="-1" id="sideNav">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Menu</h5>
              <button
                className="btn-close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Home</li>
                <li className="list-group-item">Profile</li>
                <li className="list-group-item">Settings</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-11 border rounded bg-light">
          {/* navbar of chats - 2nd div*/}
          <div className="border rounded p-2">
            <span>
              <input type="checkbox" />
            </span>
          </div>
          {/* buttons + chats */}
          <div className=" border rounded">
            {/* buttons */}
            <div
              className="border rounded p-2 row"
              style={{ height: "3.5rem" }}
            >
              <span className="col-2">Primary</span>
              <span className="col-2">Social</span>
            </div>
            {/* Chats */}
            <div className="border rounded p-2">
              <div className="row">
                <div className="col-1">
                  <input type="checkbox" />
                </div>
                <div className="col-1">
                  <li className="start"></li>
                </div>
                <div className="col-2">Name</div>
                <div className="col-7">Message</div>
              </div>
            </div>
            <div className="border rounded p-2">
              <div className="row">
                <div className="col-1">
                  <input type="checkbox" />
                </div>
                <div className="col-1">
                  <li className="start"></li>
                </div>
                <div className="col-2">Name</div>
                <div className="col-7">Message</div>
              </div>
            </div>
            <div className="border rounded p-2">
              <div className="row">
                <div className="col-1">
                  <input type="checkbox" />
                </div>
                <div className="col-1">
                  <li className="start"></li>
                </div>
                <div className="col-2">Name</div>
                <div className="col-7">Message</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
