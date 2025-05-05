import React,{useState, useEffect} from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import SweetAlert from 'react-bootstrap-sweetalert';


function ManageSubUser() {

    const [subusers, setSubUsers] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [delId, setDelId] = useState(false);
    const TOKEN = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    },[])

    const fetchUsers = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization",  `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/get-sub-user`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            setSubUsers(result.data);
        })
        .catch((error) => console.error(error));
    }

    const deleteUser = () => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TOKEN}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API_URL}/app/delete-sub-user/${delId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if(result.status){
                fetchUsers();
                window.showToast(result.message,'success');
            }else{
                window.showToast(result.message,'error');
            }
            setShowAlert(false);
        })
        .catch((error) => console.error(error));
    }

    const handleConfirm = (user) => {
        setDelId(user);
        setShowAlert(true);
    }

    const actionBodyTemplate = (user) => {
        return (
            <div className='action_btns'>
                <Link to={`/edit-sub-user/${user.id}`}>
                    <button className="edit_btn btn"> <i className="pi pi-pen-to-square"></i> </button>
                </Link>
                <button className="delete_btn btn" onClick={()=>{handleConfirm(user.id)}}> <i className="pi pi-trash"></i> </button>
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
                onConfirm={deleteUser}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
            >
                You will not be able to recover your record!
            </SweetAlert>

            <div className="manage_sub_user_page">
                <div className='msup_block'>
                    <div className='d-sm-flex justify-content-between align-items-center'>
                        <h1 className='page_title'>Manage Sub-Users</h1>
                        <div className="d-flex">
                            <Link to="/manage-role" className="btn add_role_btn me-2">  Manage Roles </Link>
                            <Link to="/add-sub-user" className="btn add_role_btn"> Add Sub-User </Link>
                        </div>
                    </div>

                    <DataTable value={subusers} paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="s_no" header="#"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="phone_number" header="Phone Number"></Column>
                        <Column field="role_name" header="Role"></Column>
                        <Column field="action" header="Action" body={actionBodyTemplate}></Column>
                    </DataTable>

                </div>
            </div>
        </>
    );
}

export default ManageSubUser;
