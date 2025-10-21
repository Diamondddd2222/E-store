import { useState } from "react";

function NigeriaStateDropdown({onStateSelect}) {
  const states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ];

  const [selectedState, setSelectedState] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (stateName) => {
    setSelectedState(stateName);
    setShowDropdown(false);
    if (onStateSelect && typeof onStateSelect === "function"){
      onStateSelect(stateName); // pass to parent here ✅
    }
  };

  return (
    <div style={{ position: "relative", width: "250px" }}>
      {/* Input + Arrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "2px",
          cursor: "pointer",
          marginTop:'10px'
          
        }}
      >
        <input
          type="text"
          value={selectedState}
          readOnly
          placeholder="Select your state"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            width: '100%'
          }}
        />
        <span
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            marginLeft: "8px",
            cursor: "pointer",
            fontSize: "10px",
            userSelect: "none",
          }}
        >
          ▼
        </span>
      </div>

      {/* Slide-up dropdown */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            bottom: "110%",
            left: 0,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}
        >
          {states.map((state, index) => (
            <div
              key={index}
              onClick={() => handleSelect(state)}
              style={{
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {state}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NigeriaStateDropdown;
