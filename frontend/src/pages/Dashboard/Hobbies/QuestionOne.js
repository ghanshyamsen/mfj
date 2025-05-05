import React, {useState, useEffect} from 'react';
import { useWizard } from "react-use-wizard";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Skeleton } from 'primereact/skeleton';
import Plus from '../../../assets/images/plus.svg';
import Close from '../../../assets/images/close-white.png';

function QuestionOne({ GoNextStep, goDashboardPage, checked, setChecked }) {

    const { nextStep } = useWizard();
    const TOKEN = localStorage.getItem('token');
    const [hobbies, setHobbies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [addHobbies, setAddHobbies] = useState([]);
    const [newHobbies, setNewHobbies] = useState("");

    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-hobbies`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status === 'S'){
                setHobbies(result.data);
            }
            setLoading(true);
        })
        .catch((error) => console.error(error.message))
        .finally(() => setLoadingSkeleton(false));

        const customHobbies = checked.filter(value => value.cat === 'Custom');

        // Ensure not to duplicate hobbies
        setAddHobbies(prevHobbies => [...prevHobbies, ...customHobbies.filter(hobby => !prevHobbies.includes(hobby))]);
    },[])


    const closeInfomastion = () => {
        goDashboardPage();
    }

    const handleClickNext = () => {
        if(checked.length <= 0){
            window.showToast("Please select at least one hobby.",'error');
        }else{
            GoNextStep();
            nextStep();
        }
    }

    const handleChange = (e,value) => {

        let updatedSelected;
        if(e.target.checked){
            if(checked.length >= 10){
                e.target.checked = false;
                window.showToast("You can't select more than 10 hobbies.",'error');
                return
            }
            updatedSelected = [...checked, value];
        }else{
            updatedSelected = checked.filter(item => item.id !== value.id);
        }

        setChecked(updatedSelected);
    }

    const handleAddHobbies = (e) => {

        if(checked.length >= 10){
            setNewHobbies("");
            setShowInput(false);
            window.showToast("You can't select more than 10 hobbies.",'error');
            return
        }
        if (newHobbies.trim() !== "") {
            let hobby = newHobbies.trim()
            if(!checked.some(item => item.title.toLowerCase() === hobby.toLowerCase())){
                const value = {
                    cat:'Custom',
                    id: null,
                    title: hobby
                }
                setAddHobbies([...addHobbies, value]);
                setNewHobbies("");
                setShowInput(false);
                setChecked([...checked, value]);
            }else{
                window.showToast("Duplicate entry, this hobby already added or selected.",'error');
            }
        }
    };

    const handleRemoveHobbies = (indexToRemove, value) => {

        let updatedSelected = checked.filter(item => item.cat !== value.cat && item.title !== value.title);
        let updatedCutstom = addHobbies.filter((_, index) =>  index !== indexToRemove)
        setChecked([...updatedSelected, ...updatedCutstom]);
        setAddHobbies(updatedCutstom);
    };

    return (
        <>
            {loading && <div>
                <div className="rim_content">
                    <h1 className="rim_heading">Which of the following hobbies and interests do you enjoy in your free time?</h1>
                    <p className='rim_text mb-0'> Please select up to 10 activities </p>
                </div>

                <div className='hobbies_select_block'>
                    {hobbies.map(({ title, hobbies },index) => (
                        <div key={index} className='hobbies_type_block'>
                            <h3 className="hobbies_title"> {title} </h3>
                            {hobbies.map((value, i) => (
                                <label key={value.s_no} className="checkbox">
                                    <input type="checkbox"  checked={checked.some(item => item.id === value.id)} onChange={(e)=>{handleChange(e,{
                                        cat:title,
                                        id: value.id,
                                        title: value.title
                                    })}} />
                                    <span className="checkmark">
                                        {value.image && <img src={value.image} alt={value.title} />} {value.title}
                                    </span>
                                </label>
                            ))}
                        </div>
                    ))}

                    <h2><span>Or</span></h2>

                    <div className='mb-3'>
                        {!showInput && (
                            <>
                                {loadingSkeleton ?
                                    <Skeleton width="100%" height='66px' />
                                :
                                    <>
                                        <button className="add_education mb-0 d-flex align-items-center justify-content-between" onClick={() => setShowInput(true)}>
                                            <span> Add custom </span> <img src={Plus} alt="" />
                                        </button>
                                        <small style={{color:"#6E6E73", paddingLeft: "10px"}}> Optional </small>
                                    </>
                                }
                            </>
                        )}

                        {showInput && (
                            <>
                                <FloatingLabel controlId="floatineducation" label="Enter Your Hobbies" className="mb-3">
                                    <Form.Control
                                        value={newHobbies}
                                        onChange={(e) => setNewHobbies(e.target.value)}
                                        placeholder=""
                                        maxLength="50"
                                    />
                                </FloatingLabel>
                                <button className="btn submit_btn add_btn" onClick={handleAddHobbies} type="button"> Add </button>
                            </>
                        )}
                    </div>
                    <div className="job_title_row mb-2">
                        {addHobbies.map((value, index) => (
                            <label key={index} className="job_title_item checkbox p-0 border-0 "  style={{background:"transparent"}}>
                                <input
                                    type="checkbox"
                                    checked
                                    onChange={(e) =>
                                        handleChange(e, {
                                            cat: value.cat,
                                            id: value.id,
                                            title: value.title,
                                        })
                                    }
                                />
                                <span className="checkmark">
                                    {value.title}
                                    <span  className="close-btn"
                                        onClick={() => handleRemoveHobbies(index, value)}> <img src={Close} alt="Close" className='me-0 ms-1'/>
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>


                </div>

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn back-button' onClick={closeInfomastion}> Back </button>
                    <button type="button" className='btn submit_btn' onClick={handleClickNext}> Next </button>
                </div>
            </div>}
        </>
    )
}

export default QuestionOne;
