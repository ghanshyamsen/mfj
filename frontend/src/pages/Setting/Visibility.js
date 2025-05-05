import React, {useState, useEffect} from 'react';
import userDataHook from "../../userDataHook";

function Visibility() {

    const [selectedOption, setSelectedOption] = useState("");
    const TOKEN = localStorage.getItem("token");
    const userData = userDataHook();

    const [checked, setChecked] = useState(userData.profile_image_visible);

    const handleOptionChange = (option) => {
        setSelectedOption(option);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "visibility": option
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${userData._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === "success"){
                window.showToast("Visibility settings updated successfully.", 'success');
                localStorage.setItem("userData", JSON.stringify(result.data));
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error.message));
    };

    const options = [
        { id: 'public', label: 'Public (Visible to everyone)' },
        { id: 'private', label: 'Private (Visible to companies)' }
    ];

    useEffect(() => {
        setSelectedOption(userData.visibility || '');
    },[userData]);

    const handleChange = (event) => {
        setChecked(event.target.checked);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify({
            "profile_image_visible": event.target.checked
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${userData._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === "success"){
                window.showToast("Visibility update successfully.", 'success');
                localStorage.setItem("userData", JSON.stringify(result.data));
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error.message));

    }

    const CustomCheckbox = ({ id, label, checked, onChange, value }) => {
        return (
            <label className="custom-checkbox radio-button">
                <input
                    type="checkbox"
                    id={id}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                />
                <span className="checkmark" style={{top: '17px',zIndex: 1}}></span>

                <span className="radio-button-label">{label}</span>
            </label>
        );
    };


    return(
        <>
            <div className="heading_block">
                <h1 className="heading"> Visibility </h1>
            </div>
            <div className='setting_common_block personal_info_block'>
                <div className="custom-radio-buttons">
                    {options.map(option => (
                        <label key={option.id} className={`radio-button ${selectedOption === option.id ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                value={option.id}
                                checked={selectedOption === option.id}
                                onChange={() => handleOptionChange(option.id)}
                            />
                            <span className="radio-button-label">{option.label}</span>
                        </label>
                    ))}

                    <div className='custom_check_box'>
                        <CustomCheckbox
                            id="profile_image_visible"
                            name="profile_image_visible"
                            label="Visible Professional Photo In Resume"
                            checked={checked}
                            onChange={handleChange}
                        />
                    </div>
                </div>


            </div>

        </>
    );
}

export default Visibility;

