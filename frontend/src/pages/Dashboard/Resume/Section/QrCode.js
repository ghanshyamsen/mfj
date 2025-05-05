import QRCode from "react-qr-code";
import { Link, useParams } from 'react-router-dom'


function QrCode({user}) {

    const { key} = useParams();

    const ConfigData = JSON.parse(localStorage.getItem('ConfigData'));
    const shareURL = process.env.REACT_APP_URL+'/public-resume/'+key+'/'+user._id;
    return (
        <>
            <div className="qr-block">
                <div className="qrcode_block">
                    {/* Qr Code */}
                    <div className="qrcode_img">
                        <QRCode
                            size={256}
                            style={{
                                height: "auto",
                                maxWidth: "100%",
                                width: "100%",
                            }}
                            value={shareURL}
                            viewBox={`0 0 256 256`}
                        />
                    </div>


                    {/* Name and link */}
                    <div className="qrcode_info">
                        <p className="sname">{user.first_name} {user.last_name}</p>
                        <p className="sitename">On MyFirstJob</p>
                        <Link to={shareURL} target="_blank">Open</Link>
                    </div>

                    {/* Logo */}
                    <div className="sLogo">
                        <img src={ConfigData.app_logo} alt="" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default QrCode;
