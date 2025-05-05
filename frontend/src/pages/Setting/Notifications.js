import React, {useState, useEffect} from 'react';
import userDataHook from "../../userDataHook";

const CustomCheckbox = ({ id, label, checked, onChange, value }) => {
    return (
        <label className="custom-checkbox">
            <input
                type="checkbox"
                id={id}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <span className="checkmark"></span>
            {label}
        </label>
    );
};


function Notifications() {

    const TOKEN = localStorage.getItem("token");
    const userData = userDataHook();
    const [checkboxes, setCheckboxes] = useState({
        communication_setting_one: false,
        communication_setting_two: false,
        communication_setting_three: false,
        communication_setting_four: false
    });


    const handleCheckboxChange = (event) => {
        const obj = { ...checkboxes, [event.target.id]: event.target.checked};
        setCheckboxes(obj);
        handleSubmit(obj);
    };


    const handleSubmit = (obj) => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const raw = JSON.stringify(obj);

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/update-profile/${userData._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status == "success"){
                window.showToast("Notification settings updated successfully.", 'success');
                localStorage.setItem("userData", JSON.stringify(result.data));
            }else{
                window.showToast(result.message, 'error');
            }
        })
        .catch((error) => console.error(error.message));
    };

    useEffect(() => {
        setCheckboxes({
            communication_setting_one: userData.communication_setting_one,
            communication_setting_two: userData.communication_setting_two,
            communication_setting_three: userData.communication_setting_three,
            communication_setting_four: userData.communication_setting_four
        });
    },[]);

    return(
        <>
            <div className="heading_block">
                <h1 className="heading"> Notifications </h1>
            </div>

            <div className='setting_common_block notification_block'>
                <h2 className='notification_heading'> Email Notifications </h2>
                <div className='custom_check_box'>
                    <CustomCheckbox
                        id="communication_setting_one"
                        name="communication_setting_one"
                        label="Application Updates"
                        checked={checkboxes.communication_setting_one}
                        onChange={handleCheckboxChange}
                    />
                    <CustomCheckbox
                        id="communication_setting_two"
                        name="communication_setting_two"
                        label="Weekly Job Digest"
                        checked={checkboxes.communication_setting_two}
                        onChange={handleCheckboxChange}
                    />
                    <CustomCheckbox
                        id="communication_setting_three"
                        name="communication_setting_three"
                        label="Promotion & News"
                        checked={checkboxes.communication_setting_three}
                        onChange={handleCheckboxChange}
                    />
                    <CustomCheckbox
                        id="communication_setting_four"
                        name="communication_setting_four"
                        label="Exclusive offers"
                        checked={checkboxes.communication_setting_four}
                        onChange={handleCheckboxChange}
                    />
                </div>
            </div>
        </>
    );
}

export default Notifications;

