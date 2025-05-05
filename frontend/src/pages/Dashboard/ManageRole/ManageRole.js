import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import backArrow from '../../../assets/images/fi_arrow-left.svg';


function ManageRole() {

    const TOKEN = localStorage.getItem('token');
    const [roles, setRoles] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [delId, setDelId] = useState(false);

    useEffect(()=>{
        fetchRoles()
    },[])


    const fetchRoles = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization",  `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-role`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            setRoles(result.data);
        })
        .catch((error) => console.error(error));
    }

    const deleteRole = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-role/${delId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                fetchRoles();
                window.showToast(result.message,'success');
            }else{
                window.showToast(result.message,'error');
            }
            setShowAlert(false);
        })
        .catch((error) => console.error(error));
    }

    const handleConfirm = (role) => {
        setDelId(role);
        setShowAlert(true);
    }

    const actionBodyTemplate = (role) => {

        return (
            <div className='action_btns'>
                <Link to={`/edit-role/${role.id}`}>
                    <button className="edit_btn btn" > <i className="pi pi-pen-to-square"></i> </button>
                </Link>

                <button className="delete_btn btn" onClick={()=>{handleConfirm(role.id)}}> <i className="pi pi-trash"></i> </button>
            </div>
        );
    };

    return (

        <>
            <SweetAlert
                show={showAlert}
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={deleteRole}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                You will not be able to recover your record!
            </SweetAlert>

            <div className="manage-role-page">
                <div className='manage_role_block'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h1 className='page_title'> <Link to="/manage-sub-user" className="btn arrow_back_btn"> <img src={backArrow} alt="" /> </Link> Manage Roles</h1>
                        <Link to="/add-role" className="btn add_role_btn"> Add Role </Link>
                    </div>

                    <DataTable value={roles} paginator rows={10}  tableStyle={{ minWidth: '50rem' }}>
                        <Column field="s_no" header="#"></Column>
                        <Column field="role_name" header="Sub Admin Roles"></Column>
                        <Column field="updated" header="Update Date"></Column>
                        <Column field="id" header="Action" body={actionBodyTemplate}></Column>
                    </DataTable>

                </div>
            </div>
        </>
    );
}

export default ManageRole;
