import React, {useState, useEffect} from "react";
import { Skeleton } from 'primereact/skeleton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchIcon from '../../assets/images/search.svg';
import Resources1 from '../../assets/images/howimg2.png';
import NoImage from '../../assets/images/no_image_logo.jpg';

import { Link } from 'react-router-dom';

import InfiniteScroll from 'react-infinite-scroll-component';

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


function Resources() {

    const TOKEN = localStorage.getItem('token');
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);

    let debounceTimer;
    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        setOffset(0);
    };

    const debounceValue = useDebounce(searchTerm, 500);

    useEffect(() => {
        loadArticles()
    }, [debounceValue]);

    const loadArticles = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-articles?offset=${offset}&keyword=${searchTerm}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status) {
                if(offset === 0){
                    setArticles(result.data);
                }else{
                    setArticles((prevJobs) => [...prevJobs, ...result.data]);
                }
                setOffset(prevOffset => prevOffset + result.data.length);

                if(result.data.length === 0){
                setHasMore(false);
                }
                setLoading(true);
            }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoadingSkeleton(false));
    }


    return(
        <div className="common_background_block resources_page">
            <div className="recent_block">
                <div className='search_block'>
                    {loadingSkeleton ?
                        <Skeleton width="100%" height='57px'  className="mb-3"/>
                        :
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="keywords">
                            <img src={SearchIcon} alt="" />
                            </InputGroup.Text>
                            <Form.Control
                            placeholder="Search Resources..."
                            aria-label="keywords"
                            aria-describedby="keywords"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            />
                        </InputGroup>
                    }
                </div>
                {/* resources block */}
                <div className="resources_block">

                    {loadingSkeleton ?
                        <div className="resources_cards">
                            <div className="rc_img">
                                <Skeleton width="100%" height='224px' style={{borderRadius: "20px 0px 0px 20px"}} />
                            </div>
                            <div className="rc_body">
                                <Skeleton width="100%" height='28px' className="mb-3"/>
                                <ul className="category_list">
                                    <Skeleton width="100%" height='28px'/>
                                </ul>
                                <Skeleton width="100%" height='40px' className="mb-3"/>
                                <Skeleton width="100%" height='34px'/>
                            </div>
                        </div>
                        :
                        <>
                            {loading && <InfiniteScroll
                                dataLength={articles.length} //This is important field to render the next data
                                next={loadArticles}
                                hasMore={hasMore}
                                loader={<h4>Loading...</h4>}
                                endMessage={
                                    articles.length > 0 && <p style={{ textAlign: 'center' }}>
                                        <b>Yay! You have seen it all.</b>
                                    </p>
                                }>
                                {
                                    articles.length > 0 &&

                                    articles.map(article => (
                                        <div className="resources_cards" key={article.id}>
                                            <div className="rc_img">
                                            <Link to={(article.type=='external'?article.link:`/resource-detail/${article.id}`)} target={article.type==='external'?"_blank":''}> <img src={article.image||NoImage} alt="" /> </Link>
                                            </div>
                                            <div className="rc_body">
                                            <Link to={(article.type=='external'?article.link:`/resource-detail/${article.id}`)} target={article.type==='external'?"_blank":''}><h3 className="rc_title"> {article.title} </h3> </Link>
                                                <ul className="category_list">
                                                    <li> {article.category} </li>
                                                </ul>
                                                <p className="pdate"> {article.created} </p>
                                                <p className="rc_description">{article.description}</p>
                                                <Link to={(article.type=='external'?article.link:`/resource-detail/${article.id}`)} target={article.type==='external'?"_blank":''}> <button className='btn apply_btn'>View Article</button> </Link>
                                            </div>
                                        </div>
                                    ))

                                }
                            </InfiniteScroll>}

                            {loading && articles.length === 0 && <div className='notshowjob'> We couldn't find any articles matching your request. </div>}
                        </>
                    }
                </div>
            </div>

        </div>
    )
}

export default Resources;