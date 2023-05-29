import "./settings.css";
import {ArchiveAdd, Edit2} from "iconsax-react";


const Settings = ({header, id}) => {
    return (
        
        <div className="settings-main">
            <div className="settings-header"> Przykładowy login
            </div>
           

            <div className="settings-user"> * Admin
            
            <div className="settings-user-delate"> <ArchiveAdd variant="Bold"/> <Edit2 variant="Bold" /> </div>

            </div>           
            <div className="settings-bottom"></div>
        </div>                
);
};

export default Settings;
