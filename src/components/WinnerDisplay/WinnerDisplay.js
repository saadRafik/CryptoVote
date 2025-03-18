import React from "react";

const WinnerDisplay = ({ winner }) => {
    return (
        <div className="winner-container">
            {winner ? (
                <h2>Winner: {winner.text} with {winner.votes} votes</h2>
            ) : (
                <h2>No winner yet</h2>
            )}
        </div>
    );
};

export default WinnerDisplay;
