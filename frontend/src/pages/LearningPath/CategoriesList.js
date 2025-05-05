import React, { useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";

function CategoriesList() {

    const [category, setCategory] = useState([]);
    const TOKEN = localStorage.getItem('token');

    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-learning-path`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                setCategory(result.data);
            }
        })
        .catch((error) => console.error(error.message));

    },[])

    const listRef = useRef(null);

    const scrollLeft = () => {
      listRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
      listRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    return (
        <>
            <div className='categories_list_menu'>
                <div className='common_container'>
                    <div className='scrolling-list-container'>
                        <button onClick={scrollLeft} className='arrow left-arrow'>{'<'}</button>
                        <div className='scrolling-list' ref={listRef}>
                            <ul>
                                {
                                    category.map((value, index) =>  <li key={value.id}><Link to={`/learning-path-detail/${value.id}`}>{value.title}</Link></li> )
                                }
                            </ul>
                        </div>
                        <button onClick={scrollRight} className='arrow right-arrow'>{'>'}</button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default CategoriesList;