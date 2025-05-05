const puppeteer = require('puppeteer'); // version 19.0.0
const stream = require('stream');

const HtmlContents = async (html) => {

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
                <style>

                    @page { size: auto; margin: 0; }

                    .content {
                        height: 100%;
                        width: 100%;
                        background-color: #ffffff;
                    }

                    *{ box-sizing: border-box;
                        margin: 0 0;
                        padding: 0;
                        outline: none;
                        -ms-word-break: break-word;
                        word-break:keep-all;
                        word-wrap: break-word;
                    }
                    html, body {
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        background-color: #ffffff; /* Ensure the background covers the entire page */
                    }


                    div, p, h1, h2, h3, h4, h5, h6, span{word-break: break-word;}

                    body { font-family: 'Poppins', sans-serif !important; font-style: normal !important; }

                    .blackAndWhite { filter: grayscale(100%);}

                    .blackAndWhite {
                        color: #000 !important; /* Set all text color to black */
                        background-color: #fff !important; /* Set background color to white */
                    }

                    .blackAndWhite {
                        color: #333 !important; /* Slightly lighter text for nested elements */
                        background-color: #f7f7f7; /* Light gray background for nested elements */
                        border-color: #ccc !important; /* Set border color to a light gray */
                        box-shadow: none !important; /* Remove shadows */
                        outline: none !important; /* Remove outlines */
                    }

                    /* Additional styles for specific tags */
                    .blackAndWhite a {
                        color: #000 !important; /* Black color for links */
                        text-decoration: underline; /* Keep underline for clickable links */
                    }

                    .blackAndWhite img {
                        filter: grayscale(100%) contrast(100%) brightness(100%); /* Apply grayscale to images only */
                    }

                    .blackAndWhite .default_resume_content .heading { background: #969696 !important; color: #fff !important;}
                    .blackAndWhite .linfo_block p .hobi_img img, .blackAndWhite  .rinfo_block p .hobi_img img { filter: grayscale(100%) contrast(100%) brightness(100%); /* Apply grayscale to images only */ }
                    .blackAndWhite .cr_top_row { background: #969696 !important; }

                    .new-page-wrapper.a4 { height: 296.81mm !important; position: relative !important; }
                    .default_resume_content:first-child .resume_page_block { flex-direction: column; }
                    .classic_resume_content:first-child .resume_page_block { flex-direction: column; }
                    .resume_page_block { width: 100%; background: #fff; display: flex; height: 296.82mm !important; }

                    .default_resume_content .user_block { padding: 35px;border-bottom: 1px solid #E0E0E0; display: flex; align-items: center; min-height: 150px; }
                    .resume_page_block .user_img { width: 92px; height: 92px; border-radius: 50%; margin:0px 95px 0px 65px; }
                    .resume_page_block .user_img img { width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 50%; }
                    .resume_page_block .user_name { font-size: 28pt;font-weight: 500; line-height: 33.6px;text-align: left; color: #1D1D1F; margin-bottom: 16px; }

                    .user_info_content { width:100%; display: flex; height: 100%;}
                    .uic_default_content { width: 35.5%; padding-right: 16px; border-right: 1px solid #E0E0E0; padding-top: 24px; padding-left: 16px;}
                    .uic_default_right_content { width: 64.5%; padding-top: 24px; padding-left: 25px; padding-right: 25px;  }

                    .new-page-wrapper.a4.default_resume_content:first-child .resume_page_block .user_info_content { height: calc(100% - 167px); }
                    .resume_page_block.classic_resume_content:first-child .user_info_content { height:calc(100% - 167px);}

                    .referances_block p { padding-left: 0px !important; }
                    .contact_info_block p { padding-left: 0px !important; }
                    .linfo_block { margin-bottom: 25px;}
                    .default_resume_content .heading { background: #EE844F; padding: 8px 12px;border-radius: 16px;font-size: 12pt;font-weight: 600; margin-bottom: 15px;text-align: left; color: #fff; text-transform: uppercase; }
                    .linfo_block p, .rinfo_block p {font-size: 8px; line-height: 21px; color: #1D1D1F; display: flex; margin-bottom: 12px; padding: 0px 10px; align-items: center;}
                    .linfo_block p .hobi_img, .rinfo_block p .hobi_img { width: 14px; height: 14px; margin-right: 8px; display: inline-block;}
                    .linfo_block p .hobi_img img, .rinfo_block p .hobi_img img { width: 100%; height: 100%; object-fit: contain; object-position: center;}
                    .linfo_block p img, .rinfo_block p img { width: 14px;height: 14px;margin-right: 8px;}

                    .default_resume_content .linfo_block p { padding-left: 12px !important; }
                    .default_resume_content .referances_block p { padding-left: 12px !important; }

                    .referances_block .ctitle{ margin-bottom: 10px !important; }
                    .referances_block .owner { margin-bottom: 0px !important; }
                    .referances_block .push { margin-bottom: 14px !important; }
                    .certification_block .push { margin-bottom: 14px !important; }

                    .rinfo_block { margin-bottom: 25px;}
                    .rinfo_block .m-text { font-size: 10pt; font-weight: 400; line-height: 24px; text-align: left; margin-bottom: 5px;color: #1D1D1F; padding: 0px 10px;}
                    .rinfo_block .d-text { color: #6E6E73; font-size: 9pt; font-weight: 500; line-height: 24px;text-align: left; margin-bottom: 5px;padding: 0px 10px;}
                    .rinfo_block .sub_title { font-size: 10pt;font-weight: 600; line-height: 24px; color: #1D1D1F; margin-bottom: 0px;padding: 0px 10px; margin-top: 0px;}
                    .rinfo_block .m-text.m_title { font-weight: 500; font-size: 9pt; }

                    .work_experience_block div.push { margin-bottom: 10px; }
                    .work_experience_block div.push:last-child { margin-bottom: 0px; }

                    .classic_resume_content { padding: 0; }
                    .classic_resume_content .linfo_block p { margin-bottom: 14px; padding-right: 8px; }
                    .classic_resume_content .heading {width: 100%; font-size: 12pt; font-weight: 600; margin-bottom: 12px;text-align: left; color: #1D1D1F; text-transform: uppercase; }
                    .classic_resume_content .uic_default_content { border: none !important; padding-left: 0px;padding-top: 0px; }
                    .linfo_block .owner, .rinfo_block .owner { font-size: 10pt;font-weight: 600; line-height: 18px;color: #1D1D1F; margin-bottom: 5px;padding: 0px 10px;}
                    .linfo_block .ctitle, .rinfo_block .ctitle { font-size: 9pt;font-weight: 500; line-height: 18px;text-align: left; margin-bottom: 5px;color: #1D1D1F; padding: 0px 10px;}
                    .classic_resume_content .uic_default_right_content { padding-left: 5px;padding-right: 10px;padding-top: 0px;}
                    .classic_resume_content .user_info_content { padding: 15px;}
                    .cr_top_row {  background: #EE844F; /* min-height: 167px; */ }
                    .cr_top_row .user_block { display: flex; align-items: center; padding: 20px;}
                    .classic_resume_content .resume_page_block .user_img { margin:0px 20px 0px 0px; }
                    .classic_resume_content .resume_page_block .user_name { color: #fff; }

                    .classic_resume_content .rinfo_block .m-text { padding: 0px; }
                    .classic_resume_content .rinfo_block .sub_title{ padding: 0px; }
                    .classic_resume_content .rinfo_block .d-text { padding: 0; }

                    .cr_top_row .contact_info { display: flex; width: 100%; padding: 0px 20px 20px; }
                    .cr_top_row .contact_info .icon { width: 22px;height: 22px;border-radius: 50%; margin-right: 10px;display: flex; align-items: center; justify-content: center; background: #1D1D1F; }
                    .cr_top_row .contact_info .icon img { width: 14px;height: 14px;object-fit: contain; object-position: center; filter: invert(1); }
                    .cr_top_row .contact_info p {font-size: 10pt;line-height: 18px;color: #fff; width: 33.33%; display: flex; margin-bottom: 0px; align-items: center; padding-right: 10px; }
                    .cr_top_row .contact_info p span + span { width: 100%; flex: 1; }
                    .linfo_block p span + span { flex: 1; }

                    .resume_page_block ul { margin-bottom: 0px;padding-left: 15px;}
                    .resume_page_block ul li { font-size: 10pt;font-weight: 400; line-height: 18px;text-align: left; margin-bottom: 5px;color: #1D1D1F; }


                    .form-floating > .form-control-plaintext  label::after, .form-floating > .form-control:focus  label::after, .form-floating > .form-control:not(:placeholder-shown)  label::after, .form-floating > .form-select  label::after {
                        background-color: #f5f5f5 !important;
                    }

                    .dark_resume_content { padding: 0px;}
                    .dark_resume_content .heading {width: 100%; font-size: 12pt;font-weight: 600; padding: 8px 0px;color: #1D1D1F; margin-bottom: 12px;text-align: left;  text-transform: uppercase; border-bottom: 1px solid #EEEEEE; }
                    .dark_resume_content .linfo_block  .heading { color: #fff; }
                    .dark_resume_content .uic_default_content { padding: 20px; border: none !important;background: #1D1D1F; height: 100%;  }
                    .dark_resume_content .linfo_block { color: #fff; }
                    .dark_resume_content .rinfo_block { color: #1D1D1F; margin-bottom: 15px; width: 100%; }
                    .dark_resume_content .user_name { font-weight: bold; margin-top: 5px; margin-bottom: 15px; min-height: 82px; display: flex; align-items: center;}
                    .dark_resume_content .rinfo_block .sub_title { padding: 0px; }
                    .dark_resume_content .rinfo_block .d-text{ padding: 0px;}
                    .dark_resume_content .rinfo_block .m-text { padding: 0px;}
                    .dark_resume_content .resume_page_block .user_img  { margin: 0px auto 10px; }
                    .dark_resume_content .linfo_block p { color: #fff; margin-bottom: 15px; padding-right: 5px;}
                    .dark_resume_content.resume_page_block ul li { color: #fff; }
                    .dark_resume_content .linfo_block.contact_info_block p img { filter: invert(1); }
                    .dark_resume_content .uic_default_right_content { padding: 20px 20px;}

                    .dark_resume_content .uic_default_content .heading { color: #fff;  }
                    .dark_resume_content .uic_default_content .m-text { color: #fff; }
                    .dark_resume_content .uic_default_content .sub_title { color: #fff; }
                    .dark_resume_content .uic_default_content .d-text { color: #fff; }

                    .dark_resume_content .uic_default_right_content .heading { color: #1D1D1F;  }
                    .dark_resume_content .uic_default_right_content .m-text { color: #1D1D1F; }
                    .dark_resume_content .uic_default_right_content .sub_title { color: #1D1D1F; }
                    .dark_resume_content .uic_default_right_content .d-text { color: #6E6E73; }
                    .dark_resume_content .uic_default_right_content p { color: #1D1D1F; }
                    .dark_resume_content .uic_default_right_content p.owner { color: #1D1D1F; }
                    .dark_resume_content .user_name { font-size: 40px; }
                    .dark_resume_content .rinfo_block .owner { color: #1D1D1F; }

                    // .dark_resume_content .owner, .dark_resume_content .owner { color: #fff !important; }
                    /* .dark_resume_content .contact_info_block .ctitle { color: #fff; }
                    .dark_resume_content .contact_info_block p { color: #fff; }
                    .dark_resume_content .contact_info_block p img { filter: invert(1); } */

                    .qrcode_block {
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                        background: #F3F2F4;
                        padding: 8px 12px 4px;
                        border-radius: 12px;
                        align-items: center;
                        display: flex;
                    }

                    .qrcode_block .qrcode_img { min-width: 42px; height: 42px; margin-right: 8px; float: left;}
                    .qrcode_block .qrcode_img svg { max-width: 42px !important; }
                    .qrcode_block .qrcode_info { min-width: 80px; float: left; }
                    .qrcode_block .qrcode_info .sname { font-size: 11px; font-weight: 500; line-height: 12px; color: #1D1D1F; margin-bottom: 5px; }
                    .qrcode_block .qrcode_info .sitename {font-size: 9px; font-weight: 500; line-height: 4px; color: #1D1D1F; margin-bottom: 0px; }
                    .qrcode_block .qrcode_info a { text-decoration: underline; font-size: 9px; font-weight: 500; line-height: 12px; color: #EE844F; }
                    .qrcode_block .sLogo { min-width: 48px; height: 35px; margin-left: 10px; float: left; }
                    .qrcode_block .sLogo img { width: 100%; height: 100%; object-fit: contain; object-position: center; }

                   /* modern edge resume page */

                    .modernEdge_resume_page:first-child .resume_page_block { flex-direction: column; }
                    .modernEdge_resume_page .user_block { background: #1D1D1F url(../src/assets/images/moderbg.png) no-repeat; background-position: right 18% top; background-size: contain; padding-top: 8px; padding-left: 15px; padding-right: 23px; padding-bottom: 0px; display: flex; }
                    .modernEdge_resume_page .resume_page_block .user_img { width: 211px; height: 291px; padding-top: 11px; padding-right: 11px; border-radius: 0; background: #F0F0F0; margin: 0px !important; }
                    .modernEdge_resume_page .resume_page_block .user_img img { border-radius: 0;  }
                    .user_infomation { width: 100%; flex: 1; padding-left: 20px; padding-top: 32px; }
                    .modernEdge_resume_page .resume_page_block .user_name { color: #fff; font-weight: 700; font-size: 40px; border-bottom: 1px solid #EE844F; padding-bottom: 22px; margin-bottom: 20px; line-height: 120%; }
                    .modernEdge_resume_page .user_infomation .contact_info_block { color: #fff; }
                    .modernEdge_resume_page .user_infomation .contact_info_block .heading { font-weight: 600; font-size: 12px; line-height: 20px; text-transform: uppercase; color: #fff; background: transparent; padding-left: 0; }
                    .modernEdge_resume_page .user_infomation .linfo_block p, .modernEdge_resume_page .user_infomation .rinfo_block p { color: #fff; }
                    .modernEdge_resume_page .user_infomation .linfo_block p img, .modernEdge_resume_page .user_infomation .rinfo_block p img { filter: invert(1); }
                    .modernEdge_resume_page .user_info_content { padding-left: 15px;  }
                    .modernEdge_resume_page .user_info_content .uic_default_content { background: #F0F0F0; max-width: 210px; border: none !important; padding-left: 5px; padding-top: 13px; padding-right: 0px; }
                    .user_info_content .heading { font-weight: 700; font-size: 12px; line-height: 20px; text-transform: uppercase; margin-bottom: 10px; }
                    .modernEdge_resume_page .uic_default_right_content { padding-top: 14px; padding-left: 11px; padding-right: 23px;}
                    .modernEdge_resume_page .rinfo_block .heading { background: #F2F2F2; border-left: 4px solid #EE844F; padding: 4px; }
                    .modernEdge_resume_page .linfo_block .heading { background: #1D1D1F; border-radius: 10px 0px 0px 0px; color: #fff; padding: 4px; padding-left: 12px; }

                    /* Vibrant Flow resume design */

                    .vibrantflow_resume_page { width: 100%; display: block; padding-left: 6px; position: relative; }
                    .vibrantflow_resume_page:first-child:before { position: absolute; content: ""; width: 100%; height: 300px; top: 0; left: 0; background: url(../src/assets/images/resume5bg.png) no-repeat; background-position: center; background-size: cover; }
                    .vibrantflow_resume_page:first-child {  padding-top: 18px; }
                    .vibrantflow_resume_page:first-child .uic_default_content { border-radius: 100px 100px 0px 0px; margin-top: 50px; }
                    .vibrantflow_resume_page .resume_page_block { background: transparent }
                    .vibrantflow_resume_page .resume_page_block .user_img img { border: 3px solid #1D1D1F; }
                    .vibrantflow_resume_page .resume_page_block .user_name { font-weight: 700; line-height: 120%; font-size: 28px; color: #fff; padding-top: 10px; margin-bottom: 0; padding-bottom: 12px;  border-bottom: 1px solid #E3E3E3; padding-right: 40px; }

                    .vibrantflow_resume_page .uic_default_content { background: #1D1D1F; max-width: 217px; padding: 0px 15px; border: none; display: flex; flex-direction: column; }
                    .vibrantflow_resume_page .uic_default_content .user_block { margin-top: -52px; margin-bottom: 8px; }
                    .vibrantflow_resume_page .resume_page_block .user_img { margin: 0px auto; }
                    .vibrantflow_resume_page .user_info_content .heading { color: #EE844F; padding-left: 10px; position: relative; }
                    .vibrantflow_resume_page .linfo_block.contact_info_block p { color: #fff; padding-left: 8px !important; }
                    .vibrantflow_resume_page .linfo_block.contact_info_block p img { filter: invert(1); }
                    .vibrantflow_resume_page .linfo_block p { color: #fff; }

                    .vibrantflow_resume_page .uic_default_right_content { padding: 0px; padding-left: 7px; padding-top: 0px; display: flex; flex-direction: column; width: 100%; flex: 1; }
                    .vibrantflow_resume_page .flow_right_content { border-left: 1px solid #E3E3E3;  padding-top: 28px; padding-left: 3px; height: 100%; }
                    .vibrantflow_resume_page .user_info_content .flow_right_content .about_section .heading { color: #fff; }
                    .vibrantflow_resume_page .user_info_content .flow_right_content .about_section .m-text { color: #fff; position: relative; }
                    .vibrantflow_resume_page .user_info_content .heading::before { position: absolute; content: ""; width: 5px; height: 14px; border-radius: 20px;  background: #FFB03C; left: -5px; top: 3px; }
                    .vibrantflow_resume_page .flow_right_content .referances_block p { padding-left: 10px !important; }
                    .vibrantflow_resume_page .sub_title { position: relative; }
                    .vibrantflow_resume_page .sub_title::before { position: absolute; content: ""; width: 5px; height: 5px; border-radius: 20px;  background: #FFB03C; left: -5px; top: 5px; }
                    .vibrantflow_resume_page .flow_right_content .referances_block p.owner { position: relative; }
                    .vibrantflow_resume_page .flow_right_content .referances_block p.owner::before { position: absolute; content: ""; width: 5px; height: 5px; border-radius: 20px;  background: #FFB03C; left: -6px; top: 5px; }
                    .vibrantflow_resume_page .linfo_block p { position: relative; }
                    .vibrantflow_resume_page .linfo_block p::before { position: absolute; content: ""; width: 5px; height: 5px; border-radius: 20px;  background: #FFB03C; left: -6px; top: 5px; }
                    .vibrantflow_resume_page .user_info_content .flow_right_content .about_section .m-text::before { position: absolute; content: ""; width: 5px; height: 5px; border-radius: 20px;  background: #FFB03C; left: -6px; top: 5px; }
                    .vibrantflow_resume_page .flow_left_content { padding-top: 30px; border-left: 1px solid #3E3E40; padding-left: 3px; height: 100%; }

                    .vibrantflow_resume_page  .about_section { height: 200px; }

                    /* Bold Contrast resume design */

                    .contrast_resume_page .resume_page_block { flex-direction: column; }
                    .contrast_resume_page .user_block { width: 100%; display: flex; }
                    .contrast_resume_page .user_block .user_img { border-radius: 0px !important; margin: 0px; height: 100%; width: 35%; }
                    .contrast_resume_page .user_block .user_img img { border-radius: 0px; margin: 0px auto; }

                    .contrast_resume_page .user_infomation { padding-top: 30px; padding-left: 8px;  }
                    .contrast_resume_page .user_infomation .heading { font-weight: 600; font-size: 12px; text-transform: uppercase; color: #1D1D1F; border-bottom: 2px solid #EE844F; padding-bottom: 10px; margin-bottom: 10px; }
                    .contrast_resume_page .rinfo_block .m-text { padding: 0 !important; }
                    .contrast_resume_page .rinfo_block .sub_title { padding: 0 !important; }
                    .contrast_resume_page .rinfo_block .d-text { padding: 0 !important; }
                    .contrast_resume_page .user_info_content .rinfo_block .heading { border-bottom: 2px solid #EE844F; padding-bottom: 10px; margin-bottom: 10px; }
                    .contrast_resume_page .linfo_block p, 
                    .contrast_resume_page .rinfo_block p { padding: 0px !important; }
                    .contrast_resume_page .resume_page_block .user_name { font-weight: 700; font-size: 40px; line-height: 120%; position: relative; margin-bottom: 0px; padding: 10px 10px; }
                    .contrast_resume_page .resume_page_block .user_name span { position: relative}
                    .contrast_resume_page .resume_page_block .user_name::before { content: ""; width: 170%; height: 100%; background: rgba(238, 132, 79, 0.6); z-index: 0; position: absolute; top: 0; margin-left: -70%; }
                    .contrast_resume_page .about_section { padding-right: 25px; }

                    .contrast_resume_page .uic_default_content { background: #1D1D1F; border-radius: 50px; border: none !important; margin: 8px 5px; }
                    .contrast_resume_page .uic_default_content .heading { color: #fff; position: relative; }
                    .contrast_resume_page .uic_default_content .heading span { position: relative; }
                    .contrast_resume_page .uic_default_content .heading::before { position: absolute; content: ""; width: 25px; height: 25px; border-radius: 50%; background: #EE844F; left: -4px; top: -3px; z-index: 0; }
                    .contrast_resume_page .uic_default_content .linfo_block p { color: #fff; }
                    .contrast_resume_page .contact_info_block.linfo_block p img { filter: invert(1); }

                    /*  */

                    .creative_grid_resume_page .resume_page_block { flex-direction: column; }
                    .creative_grid_resume_page .user_block { width: 100%; display: flex; }
                    .creative_grid_resume_page .user_block .user_img { border-radius: 0px !important; max-width: 50%; margin: 0px; height: 100%; width: 100%; }
                    .creative_grid_resume_page .user_block .user_img img { border-radius: 0px; margin: 0px auto; }

                    .creative_grid_resume_page .contact_info_block.linfo_block .heading { font-weight: 600; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; }
                    .creative_grid_resume_page .resume_page_block .user_name { font-weight: 700; font-size: 40px; line-height: 120%; position: relative; padding: 10px 0px; margin-bottom: 16px; padding-right: 30px; }
                    .creative_grid_resume_page .uic_default_content { width: 50%; border: none !important; background: #FFB13C; }
                    .creative_grid_resume_page .uic_default_right_content { width: 50%; background: #EE844F; }
                    .creative_grid_resume_page .linfo_block p, 
                    .creative_grid_resume_page .rinfo_block p { padding: 0px !important; color: #FFF; }
                    .creative_grid_resume_page .rinfo_block .m-text { color: #fff; }
                    .creative_grid_resume_page .user_info_content .heading { color: #fff; }
                    .creative_grid_resume_page .rinfo_block .sub_title { color: #fff; padding: 0; }
                    .creative_grid_resume_page .rinfo_block .d-text { color: #fff; }
                    .creative_grid_resume_page .linfo_block .owner, 
                    .creative_grid_resume_page .rinfo_block .owner { color: #fff; }
                    .creative_grid_resume_page .linfo_block .ctitle, 
                    .creative_grid_resume_page .rinfo_block .ctitle { color: #fff; }
                    .creative_grid_resume_page .referances_block.rinfo_block p img { filter: invert(1); }
                    .creative_grid_resume_page .user_infomation .linfo_block p { color: #1D1D1F; }


                    /* professional_resume_page */

                    .professional_resume_page .uic_default_content { background: #EE844F; }
                    .professional_resume_page .resume_page_block .user_img { margin: 0px auto 23px; width: 150px; height: 150px; border-radius: 6px; border: 2px solid #fff; }
                    .professional_resume_page .resume_page_block .user_img img { border-radius: 6px; }
                    .professional_resume_page .resume_page_block .user_name { font-weight: 700; font-size: 40px; line-height: 120%; position: relative; padding: 10px 0px; }
                    .professional_resume_page .linfo_block p, 
                    .professional_resume_page .rinfo_block p { padding: 0px !important; }
                    .professional_resume_page .rinfo_block .sub_title { padding-left: 0px !important; }

                    .professional_resume_page .rinfo_block .heading { position: relative; display: inline-flex !important; background: #FCDD57; line-height: 27px; padding: 0px 28px; margin-left: -28px; margin-bottom: 10px; }
                    .professional_resume_page .rinfo_block .heading::before { content: ""; width: 0; height: 0; border-bottom: 15px solid #fff; border-left: 15px solid transparent; bottom: -1px; position: absolute; right: -1px; }
                    .professional_resume_page .rinfo_block .heading::after { content: ""; width: 0; height: 0; border-top: 15px solid #fff; border-left: 15px solid transparent; right: -1px; position: absolute; top: -1px; }


                    /*  */

                    .friendly_profile_resume_page:first-child { border-top: 14px solid #EE844F; }
                    .friendly_profile_resume_page { padding-right: 21px; background: #FEF3E2 !important; }
                    .friendly_profile_resume_page .resume_page_block .user_img { margin: 0px auto 25px; width: 100%; height: 269px; border-radius: 0px; }
                    .friendly_profile_resume_page .resume_page_block .user_img img { border-radius: 0px; }
                    .friendly_profile_resume_page .resume_page_block .user_name { font-weight: 700; font-size: 40px; text-align: center; line-height: 120%; position: relative; padding: 10px 0px; margin: 0; background-color: #EE844F; color: #fff; }
                    .friendly_profile_resume_page .linfo_block p, 
                    .friendly_profile_resume_page .rinfo_block p { padding: 0px !important; }
                    .friendly_profile_resume_page .rinfo_block .sub_title { padding-left: 0px !important; }
                    .friendly_profile_resume_page .uic_default_content { width: 65%; background: #FEF3E2; border: none; padding-right: 30px; }
                    .friendly_profile_resume_page:first-child .uic_default_right_content { padding-top: 0px !important; }
                    .friendly_profile_resume_page .uic_default_right_content { width: 35%; background: #FEF3E2; padding: 0 !important; padding-top: 24px !important; }
                    .friendly_profile_resume_page .user_info_content .rinfo_block .heading { position: relative; padding-bottom: 12px; margin-bottom: 12px; }
                    .friendly_profile_resume_page .user_info_content .rinfo_block .heading::before { position: absolute; content: ""; left: 0; bottom: 0; width: 180px; height: 2px; background: #EE844F;  }

                    /* ElegantCurve resume */

                    .elegantcurve_resume_page .uic_default_content { width: 40%; border: none; }
                    .elegantcurve_resume_page .uic_default_right_content { width: 60%; background: #1D1D1F; padding: 0px 25px;  }
                    .elegantcurve_resume_page:first-child .uic_default_right_content { padding-top: 0px; }
                    .elegantcurve_resume_page .uic_default_right_content { padding-top: 24px; }

                    .elegantcurve_resume_page .resume_page_block .user_img { margin: 0px auto 25px; width: 210px; height: 210px; border: 10px solid #fff; }
                    .elegantcurve_resume_page .linfo_block p { color: #fff; }
                    .elegantcurve_resume_page .linfo_block  .heading { color: #fff; }
                    .elegantcurve_resume_page .contact_info_block.linfo_block p img { filter: invert(1); }
                    .elegantcurve_resume_page .linfo_block p, 
                    .elegantcurve_resume_page .rinfo_block p { padding: 0px !important; }
                    .elegantcurve_resume_page .resume_page_block .user_name { font-weight: 700; font-size: 40px; text-align: center; line-height: 120%; padding: 15px 0px 15px 25px; }
                    .elegantcurve_resume_page .rinfo_block .sub_title { padding: 0px !important; }

                    .elegantcurve_resume_page:first-child { overflow: hidden; }
                    .elegantcurve_resume_page:first-child .uic_default_right_content { position: relative; border-radius: 200px 0px 0px 0px; margin-top: 110px; }
                    .elegantcurve_resume_page:first-child .uic_default_right_content::before { content: ""; width: 379px; height: 379px; display: block; border-radius: 50%; background: #EE844F; right: -98px; top: -242px; position: absolute; }
                    .elegantcurve_resume_page .user_block { position: relative; margin-top: -36px; }  




                    .edit-link{display:none;}



                </style>
            </head>
            <body>
                <div class="content">
                    ${html}
                </div>
            </body>
        </html>
    `;

    return htmlContent;
}

class PDF {

    async generate(req, res){


        const { htmlContent } = req.body;

        try {

            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });

            const page = await browser.newPage();
            const HtmlData = await HtmlContents(htmlContent);

            // Set the content of the page to the provided HTML
            await page.setContent(HtmlData, { waitUntil: 'networkidle0' });

            await page.evaluate(() => {
                document.querySelectorAll('a').forEach(link => {
                    link.setAttribute('target', '_blank');
                });
            });

            const pdfBuffer = await page.pdf({
                width: '210mm',  // Exact width of an A4 page
                height: '297mm', // Exact height of an A4 page
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px'
                },
                scale: 1.0,
                fullPage: true
            });



          await browser.close();

          // Convert the PDF buffer to a Node.js readable stream
          const pdfStream = new stream.PassThrough();
          pdfStream.end(pdfBuffer);

          // Set response headers
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="document.pdf"',
          });

          // Pipe the stream to the response
          pdfStream.pipe(res);

        } catch (error) {
          res.status(500).send({status: false, message: error.message});
        }
    }

}


module.exports = PDF;
