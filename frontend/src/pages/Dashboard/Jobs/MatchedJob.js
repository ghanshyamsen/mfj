import React, { useState, useEffect, useRef } from 'react';
import './../index.css'
import InputGroup from 'react-bootstrap/InputGroup';
import SearchIcon from '../../../assets/images/search.svg';
import { MultiSelect } from 'primereact/multiselect';
import { Skeleton } from 'primereact/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import backArrow from '../../../assets/images/fi_arrow-left.svg';
import logoimg from '../../../assets/images/no_image_logo.jpg';
import Star from '../../../assets/images/Star.svg';

import { Dropdown } from 'primereact/dropdown';
import Autocomplete from "react-google-autocomplete";
import { AutoComplete } from "primereact/autocomplete";
import RangeSlider from 'svelte-range-slider-pips';

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

const Jobs = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const TOKEN = localStorage.getItem('token');
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const personality_assessment = localStorage.getItem('personality_assessment') === 'true';
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [resume, setResume] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const [remote, setRemote] = useState(false);

  let debounceTimer;
  const handleSearchChange = (event) => {
    const searchTerm = event?.target?.value || event;

    setSearchTerm(searchTerm);
    setOffset(0);
    setHasMore(true);
  };

  const [filterData, setFilterData] = useState({
    loctype: [],
    radius: "",
    posted: "",
    salary: [],
    salary_range:[],
    jobtype:[],
    location: "",
    latitude: "",
    longitude:""
  });

  const handleChangeFilter = (event) => {
    const { name,  value } = event?.target||event;
    setFilterData({...filterData, [name]:value });
    setOffset(0);
    setHasMore(true);
  }

  const debounceValue = useDebounce(searchTerm, 500);
  const debounceValueFilter = useDebounce(filterData, 1000);

  useEffect(() => {

    if(!personality_assessment){
      window.showToast("Please complete your Personality Assessment first.",'error');
      navigate('/dashboard');
    }

    fetchResuneBuilder();
    //loadJobs()
  },[])

  useEffect(() => {
    if(!loadingSkeleton){
      setOffset(0);
      loadJobs()
    }
  }, [debounceValue,debounceValueFilter]);

  const loadJobs = (keyword=false) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const raw = JSON.stringify({
      "listed": (offset > 0?jobs.map((job) => job.id):[])
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const params = new URLSearchParams(filterData).toString();

    fetch(`${process.env.REACT_APP_API_URL}/app/get-matched-jobs?offset=${offset}&keyword=${searchTerm}&${params}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){

        if(offset === 0){
          setJobs(result.data);
        }else{
          setJobs((prevJobs) => [...prevJobs, ...result.data]);
        }
        setOffset(prevOffset => prevOffset + result.data.length);

        if(result.data.length === 0){
          setHasMore(false);
        }

        setLoading(true);

      }else{
        window.showToast(result.message,'error');
        navigate('/jobs');
      }
    })
    .catch((error) => console.error(error.message))
    .finally(() => setLoadingSkeleton(false));
  }

  const handleBack = () => {
    window.history.back();
  };


  const DatePosted = [
    {name: "Any Time", code: ""},
    {name: "1 Day", code: "1"},
    {name: "5 Days", code: "5"},
    {name: "10 Days", code: "10"},
    {name: "30 Days", code: "30"},
  ]

  const LocationType = [
    {name: "In-person at a precise location" , code: "In-person at a precise location"},
    {name: "In-person within a limited area", code: "In-person within a limited area"},
    {name: "Fully Remote (no on-site work required)", code: "Fully Remote (no on-site work required)"},
    {name: "Hybrid (some on-site work required)", code: "Hybrid (some on-site work required)"},
    {name: "On the Road (travel-based work)", code: "On the Road (travel-based work)"},
  ]

  const LocationRadius = [
    {name: "Anywhere from the location" , code: ""},
    {name: "10 Miles" , code: "10"},
    {name: "20 Miles" , code: "20"},
    {name: "30 Miles" , code: "30"},
    {name: "40 Miles" , code: "40"},
    {name: "50 Miles" , code: "50"},
    {name: "60 Miles" , code: "60"},
    {name: "70 Miles" , code: "70"},
    {name: "80 Miles" , code: "80"},
    {name: "90 Miles" , code: "90"},
    {name: "100 Miles" , code: "100"},
  ]

  const SalaryRange = [
    {name: "Hourly" , code: "Hourly"},
    {name: "Salary" , code: "Salary"},
    {name: "Commission-Based" , code: "Commission-Based"}
  ]

  const  JobType = [
    {name: "Full-time",   code: "Full-time"},
    {name: "Part-time",   code: "Part-time"},
    {name: "Contract",    code: "Contract"},
    {name: "Temporary",   code: "Temporary"},
    {name: "Internship",  code: "Internship"},
    {name: "Seasonal",    code: "Seasonal"},
  ]

  const [dropdownData, setDropDownData] = useState({
    radius: "",
    posted: "",
  })

  const handleLocation = (place) => {

    const location = place.formatted_address || place.description || ''; // Use the correct property that holds the address
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    const addressComponents = place.address_components || [];

    let street = '';
    let city = '';
    let state = '';
    let zipcode = '';
    addressComponents.forEach(component => {

        const types = component.types;

        if (types.includes('street_number')) {
            street += component.long_name + ' ';
        }

        if (types.includes('route')) {
            street += component.long_name;
        }

        if (types.includes('locality')) {
            city = component.long_name;
        }

        if (types.includes('administrative_area_level_1')) {
            state = component.short_name; // Use short_name for state abbreviations like 'NY'
        }

        if (types.includes('postal_code')) {
            zipcode = component.long_name;
        }

    });

    setFilterData(prev => ({
      ...prev,
      location:location,
      latitude,
      longitude
    }))

    setOffset(0);
  }

  const handleAddr = (e) => {
    if(!e.target.value){
      setFilterData(prev => ({
        ...prev,
        location: "",
        latitude: "",
        longitude:""
      }))
      setOffset(0);
    }
  }

  const fetchResuneBuilder = () => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/get-resume-builder`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status){
        setResume(result.data.job_prefernces);

        if(result.data.job_prefernces?.job_location?.city){

          setOffset(0);

          setFilterData(prev => ({
            ...prev,
            location:(result.data.job_prefernces?.job_location?.city+', '+result.data.job_prefernces?.job_location?.state),
            latitude: result.data.job_prefernces?.job_location?.latitude,
            longitude: result.data.job_prefernces?.job_location?.longitude
          }))

        }
      }else{
        setOffset(0);
        loadJobs();
      }
    })
    .catch((error) => console.error(error.message))
    .finally(() => setLoadingSkeleton(false));
  }

  const search = (event) => {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_API_URL}/app/find-job-suggestions?keyword=${event.query}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
        if(result.status){
            setSuggestions(result.data);
            setItems(result.data.map(item => item.job_title));
        }
    })
    .catch((error) => console.error(error.message));
  }

  const handleChangeRemote = (event) => {
    const { value, checked } = event.target;
    setRemote(checked);

    if(checked){
      setFilterData(prev => ({
        ...prev,
        location:"",
        loctype: [ "Fully Remote (no on-site work required)", "Hybrid (some on-site work required)", "On the Road (travel-based work)" ],
      }))
    }else{
      setFilterData(prev => ({
        ...prev,
        location:"",
        loctype:[],
      }))
    }

    setOffset(0);
  };

  const autocompleteRef = useRef(null);

  const clearFilter = () => {

    setHasMore(true);

    setFilterData({
      loctype: [],
      radius: "",
      posted: "",
      salary: [],
      salary_range: [],
      jobtype:[],
      location: "",
      latitude: "",
      longitude:""
    })

    if (autocompleteRef.current) {
      autocompleteRef.current.value = ""; // Directly clear the input
    }

    setSearchTerm('');

    setDropDownData({
      radius: "",
      posted: "",
    })

    setOffset(0);
  }

  const [values, setValues] = useState([0, 100000]);
  const [salrange, setSalrange] = useState([]);
  const MySlider = useRef();
  const $node = useRef();
  const currency = new Intl.NumberFormat( "en", { style: 'currency', currency: 'USD', notation: 'compact' });
  const formatter = (values) => currency.format(values);

  useEffect(() => {
    if (!MySlider.current) {

      MySlider.current = new RangeSlider({
        target: $node.current,

        props: {
          values: values,
          range: true,
          float: true,
          //prefix:"$",
          pips: true,
          first:"label",
          last:"label",
          //step:0.5,
          max:100000,
          formatter,
        }
      });

      MySlider.current?.$on('change', (e) => {
        setValues(e.detail.values);
        setSalrange(e.detail.values);
        setOffset(0);
      });

    }
  }, []);

  useEffect(() => {
    setFilterData({...filterData, ["salary_range"]:salrange });
    setOffset(0);
  },[salrange])

  const sortedJobs = jobs?.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

  return (
    <>
      <div className="jobs_page common_background_block">
        <div className="dashboard_content_block d-block">
          <h1 className='mpage_title'> Matched Jobs  </h1>

          <div className="job_filter_row">

            <div className='job_group search_title_field'>

              <InputGroup className="">
              <InputGroup.Text id="keywords">
                  <img src={SearchIcon} alt="" />
                </InputGroup.Text>
              <AutoComplete
                name="job_position"
                placeholder="Titles, keywords"
                value={searchTerm}
                suggestions={items}
                completeMethod={search}
                onChange={(e) => {
                  handleSearchChange(e?.value)
                }}
              />
              </InputGroup>
            </div>

            <div className="job_group  location_field ">

                <Autocomplete
                  className="form-control"
                  name="location"
                  apiKey= {process.env.REACT_APP_LOCATION_API_KEY}
                  defaultValue={filterData.location||''}
                  onPlaceSelected={handleLocation}
                  placeholder="Location"
                  onChange={handleAddr}
                  ref={autocompleteRef}
                  disabled={remote?true:false}
                />

            </div>

            <div className="job_group">
              <Dropdown value={dropdownData.radius||''} name="radius" onChange={(e) => {
                setDropDownData({...dropdownData, ["radius"]:e.value})
                handleChangeFilter({name:"radius", value:e.value.code}) }} options={LocationRadius} optionLabel="name"  optionValue="code" placeholder="Location Radius" className="" />
            </div>

            <div className='cmp_block checkbox_job_group'>
              <a href="#" onClick={clearFilter} style={{color:"#EE844F"}} >Clear</a>
            </div>

            <div className="job_group">
                <MultiSelect
                  value={filterData.loctype || ''}
                  name="loctype"
                  onChange={handleChangeFilter}
                  options={LocationType}
                  optionLabel="name"
                  optionValue="code"
                  className="w-full"
                  placeholder="Location Type"
                />
            </div>

            <div className="job_group">
                <Dropdown value={dropdownData.posted||''} name="posted" onChange={(e) => {
                setDropDownData({...dropdownData, ["posted"]:e.value})
                handleChangeFilter({name:"posted", value:e.value.code}) }} options={DatePosted} optionLabel="name"  optionValue="code" placeholder="Date Posted" className="" />
            </div>

            <div className="job_group">
                <MultiSelect
                  value={filterData.jobtype || ''}
                  name="jobtype"
                  onChange={handleChangeFilter}
                  options={JobType}
                  optionLabel="name"
                  optionValue="code"
                  className="w-full"
                  placeholder="Job Type"
                />
            </div>


            <div className="job_group">
              <MultiSelect
                  value={filterData.salary || ''}
                  name="salary"
                  onChange={handleChangeFilter}
                  options={SalaryRange}
                  optionLabel="name"
                  optionValue="code"
                  className="w-full"
                  placeholder="Pay Type"
                />

            </div>
            <div className="job_group price_sec">
              <div ref={$node}></div>
            </div>
          </div>

          <div className='recent_block'>
            <div className="back-btn-row"> <span className='back_bttn' onClick={handleBack}><img src={backArrow} alt="" /></span> </div>
            <div className='application_ul_list'>
                <ul>
                  <InfiniteScroll
                    dataLength={jobs.length} //This is important field to render the next data
                    next={loadJobs}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                      jobs.length > 0 && <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all.</b>
                      </p>
                    }
                  >
                    {sortedJobs && sortedJobs.length > 0 ? (
                        sortedJobs.map(job => {

                          if(loadingSkeleton){
                            return  <li key={job.s_no}>
                              <div className='aul_content'>
                                <div className='application_name'><Skeleton width="100%" height='30px' /> </div>
                                <div className='amount'><Skeleton width="100%" height='20px' /></div>
                                <div className='aul_text aul_keyword'><Skeleton width="100%" height='20px' /></div>
                                <div className='aul_text aul_location'><Skeleton width="100%" height='20px' /></div>
                                <Skeleton className='button' width="98px" height='34px' />
                              </div>
                              <div className='icon'>
                                  <Skeleton shape="circle" size="100%" className="mr-2" />
                              </div>
                            </li>
                          }else{
                            return <li key={job.id}>
                              <div className='aul_content'>
                                {job?.job_boost &&  <div className='job_tag'> <img src={Star} alt="" /> Featured Job <img src={Star} alt="" /> </div>}
                                <h4 className='application_name'> <Link to={`/job-detail/${job.id}`}> {job.job_position} </Link> </h4>
                                <p className='amount'>{job.job_payscale}</p>
                                <p className='aul_text aul_keyword'>{job?.job_pay_type}</p>
                                <p className='aul_text aul_keyword'>{job.orgnaization}</p>
                                <p className='aul_text aul_location'>{job.location||''}</p>
                                <div className='d-flex align-items-center'>
                                  <Link to={`/job-detail/${job.id}`}> <button className='btn apply_btn'>View Job</button> </Link>
                                  <p className='mb-0 matchrate_text'> {job.percentage}% Match rate </p>
                                </div>

                              </div>
                              <div className='icon'>
                                <img src={job.logo==="" ? logoimg : job.logo }   alt="" />
                              </div>
                            </li>
                          }

                        })
                      ) : (
                        loadingSkeleton ?
                        <Skeleton width="100%" height='40px' />:
                        loading && <li className='notshowjob'> We couldn't find any jobs matching your request. </li>
                    )}
                  </InfiniteScroll>
                </ul>
            </div>
          </div>
        </div>

      </div>
    </>
  );

};

export default Jobs;
