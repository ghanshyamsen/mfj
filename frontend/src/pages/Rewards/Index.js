import React, { useState, useEffect } from "react";
import './index.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

import Gift from '../../assets/images/gift.png'
import Coin from '../../assets/images/coin.png'
import NotFound from '../../assets/images/not-found.png'
import Search from '../../assets/images/u_search.svg'
import Cycle from '../../assets/images/cycle.jfif'
import Product2 from '../../assets/images/pro2.jfif'
import Product3 from '../../assets/images/pro3.jfif'
import Product4 from '../../assets/images/pro4.jfif'
import Product5 from '../../assets/images/pro5.jfif'
import Product6 from '../../assets/images/pro6.jfif'
import Product7 from '../../assets/images/pro7.jfif'
import Product8 from '../../assets/images/pro8.jfif'
import Product9 from '../../assets/images/pro9.jfif'
import Product10 from '../../assets/images/pro10.jfif'
import Product11 from '../../assets/images/pro11.jfif'
import Product12 from '../../assets/images/pro12.jfif'
import PIN1 from '../../assets/images/PIN1.png'
import { Skeleton } from 'primereact/skeleton';
import Cash from '../../assets/images/3d-cash-money.png';

import { Checkbox } from "primereact/checkbox";

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';

function useDebounce(cb, delay) {
    const [debounceValue, setDebounceValue] = useState(cb);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebounceValue(cb);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [cb, delay]);
    return debounceValue;
}


function Rewards(){


    const TOKEN = localStorage.getItem('token');
    const User = JSON.parse(localStorage.getItem('userData'));

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [credit, setCredit] = useState(User?.user_credit);

    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [category, setCategory] = useState([]);
    const [sort, setSort] = useState('new');
    const [hasMore, setHasMore] = useState(true);

    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    let debounceTimer;
    const handleSearchChange = (event) => {
      const keyword = event.target.value;
      setKeyword(keyword);
      setOffset(0);
    };

    const sortBy = (event) => {
        const keyword = event.target.value;
        setSort(keyword);
        setOffset(0);
    };

    const debounceValue = useDebounce(keyword, 1000);
    const debounceSort = useDebounce(sort, 500);
    const debounceCategory = useDebounce(category, 500);

    useEffect(() => {
        getProduct()
    }, [debounceValue, debounceSort, debounceCategory]);


    const [selectedCategories, setSelectedCategories] = useState([]);

    const onCategoryChange = (e) => {
        let _selectedCategories = [...selectedCategories];

        if (e.checked)
            _selectedCategories.push(e.value);
        else
            _selectedCategories = _selectedCategories.filter(category => category._id !== e.value._id);

        setSelectedCategories(_selectedCategories);
        setCategory(_selectedCategories.map(category => category._id).join(','));
        setOffset(0);
    };

    useEffect(() => {
        getCategory();
    },[])

    const getProduct = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-products?keyword=${keyword}&limit=${limit}&offset=${offset}&category=${category}&sort=${sort}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                if(offset === 0){
                    setProducts(result.data);
                }else{
                    setProducts((prevJobs) => [...prevJobs, ...result.data]);
                }

                setOffset(prevOffset => prevOffset + result.data.length);

                if(result.data.length === 0){
                    setHasMore(false);
                }
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));
    }

    const getCategory = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-product-category`, requestOptions)
        .then((response) => response.json())
        .then((result) => setCategories(result.data))
        .catch((error) => console.error(error));

    }

    return(
        <>
            <div className='reward_section'>
                <div className='common_container'>
                    <div className='reword_heading_block'>
                        <div className='reword_heading'>
                            <h1 className='rh_title'> Reward Store </h1>
                            {/* <div className='reword_img'> <img src={Gift} alt="" /> </div> */}
                        </div>
                        <div className='reword_balance_block'>
                            <div className='bb_left'>
                                <div className='bbl_img'> <img src={Cash} alt="" /> </div>
                                <p className='m-0'> Available Balance </p>
                            </div>
                            <div className='bb_right'>
                                <img src={Coin} alt="" />
                                <span className=''> {credit.toLocaleString('en')||0} </span>
                            </div>
                        </div>
                    </div>
                    {/*  */}

                    <div className='reward_content_list_block'>

                        <div className='reward_filter_row'>
                            {/* <h3 className='rfr_title'> Reward Store </h3> */}
                            <div className='filter_input_fields'>
                                <div className='f_group'>
                                    <InputGroup className="">
                                        <Form.Control
                                            placeholder="Search by keywords"
                                            aria-label="Search by keywords"
                                            aria-describedby="basic-addon2"
                                            onChange={handleSearchChange}
                                        />
                                        <InputGroup.Text id="basic-addon2"> <img src={Search} alt="" /> </InputGroup.Text>
                                    </InputGroup>
                                </div>
                                <div className='f_group'>
                                    <Form.Select aria-label="Default select example" onChange={sortBy}>
                                        <option>Sort By</option>
                                        <option value="new">Newest</option>
                                        <option value="old">Oldest</option>
                                        <option value="phtl">Price High to Low</option>
                                        <option value="plth">Price Low to High</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </div>
                        {/*  */}

                        <div className='category_list_block'>
                            <h3 className='category_title'> Category </h3>
                            <div className="pin_img"> <img src={PIN1} alt="" /> </div>
                            <div className="cat_list">
                                {categories.map((category) => {
                                    return (
                                        <div key={category._id} className="d-flex align-items-center cat_items">
                                            <Checkbox inputId={category._id} name="category" value={category} onChange={onCategoryChange} checked={selectedCategories.some((item) => item._id === category._id)} />
                                            <label htmlFor={category._id} className="ml-2">
                                                {category.title}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                        {/*  */}

                        <div className='reward_card_block'>
                            <Row>
                                <InfiniteScroll
                                    dataLength={products.length} //This is important field to render the next data
                                    next={getProduct}
                                    hasMore={hasMore}
                                    loader={<h4 className="loading_text">Loading...</h4>}
                                    endMessage={
                                        products.length > 0 && <p className="seentext" style={{ textAlign: 'center' }}>
                                            <b>Yay! You have seen it all.</b>
                                        </p>
                                    }
                                    className="row"
                                    scrollableTarget="window" // Set to window for global scrolling
                                >


                                    {products.map(product =>{
                                        return(
                                            <Col lg="3" sm="4" key={product.id}>
                                                <div className='reward_card_outside'>
                                                    <Link to={`/product-detail/${window.createSlug(product.title)}/${product.id}`} className='reward_card_inside'>
                                                        <div className='reward_img'>
                                                            <img src={product.image} alt=""/>
                                                        </div>
                                                        <div className='reward_body'>
                                                            <p className='reward_title'> {product.title} </p>
                                                            <p className='category_text'> {product.category} </p>
                                                            <p className='coin_text'> <span><img src={Coin} alt="" /></span> {product.price} </p>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </Col>
                                        );
                                    })}


                                </InfiniteScroll>
                            </Row>
                            {/* row */}
                            {loadingSkeleton ?
                                <div className="no_reward_card">
                                    <Skeleton width="470px" height="180px" className="ms-auto me-auto" />
                                </div>
                            :
                            <>
                                {products.length <= 0 &&
                                <div className="no_reward_card">
                                    <img src={NotFound} alt="" />
                                    <span> Sorry, Product Not Found! </span>
                                </div>
                                }
                            </>
                            }
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default Rewards;