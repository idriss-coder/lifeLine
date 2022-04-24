import { UploadFileOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { round } from "lodash";
import { useState } from "react"
import AnimateButton from 'ui-component/extended/AnimateButton';
import axios from "axios";
import settings from "utils/settings";
import Info from "views/pages/utils/Info";

const server_infos = new settings;

export default function UploadExcel({ props }) {
    const [defaultApercu, setDefaultApercu] = useState("https://img.icons8.com/cute-clipart/64/000000/upload.png");
    const [apercu, setApercu] = useState("https://img.icons8.com/cute-clipart/64/000000/upload.png");
    const [apercuExcel, setApercuExcel] = useState("https://img.icons8.com/color/144/000000/microsoft-excel-2019--v1.png");
    const [defaultFileTitle, setDefaultFileTitle] = useState("Glissé deposer les contacts ou clicker pour uploader");
    const [fileTitle, setFileTitle] = useState("Glissé deposer les contacts ou clicker pour uploader");
    const [fileSize, setFileSize] = useState("");
    const [contactFile, setContactFile] = useState({})
    const [detectDrop, setDetectDrop] = useState(false)
    const [fileSelected, setFileSelected] = useState(false)
    const [progess, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDrop = (event) => {
        setDetectDrop(false)
        const data = event.dataTransfer.getData("text")
    }

    const allowDrop = (event) => {
        //event.preventDefault()
        setDetectDrop(true)
    }

    const reset = () => {
        setFileTitle("")
        setApercu(defaultApercu)
        setFileSelected(false)
        setFileSize("")
        setFileTitle(defaultFileTitle)
    }

    const uploadToServer = async () => {
        setLoading(true)
        const url = `${server_infos.init().APP_URL}?page=setExcel`;
        const formData = new FormData();
        formData.append("file", contactFile);
        
        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percent = Math.floor((loaded * 100) / total);
                setProgress(percent);

            }
        }
        await axios.post(url, formData, config)
        .then(res => {
            reset();
            setLoading(false)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)
        })
       
        .catch(err => {
            setLoading(false)
            setError(true)
            setTimeout(() => setError(false), 2000)
        })
    }


    const handleUpload = (event) => {
        const convertionNumber = 1000
        const roundPrecision = 2;
        const acceptTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        const acceptExt   = ["csv", "xls", "xlsx"];
        const file = event.target.files[0];
        const sizeKo = round(file.size / convertionNumber, roundPrecision)
        const sizeMo = round(sizeKo / convertionNumber, roundPrecision)

        if (acceptExt.includes(file.name.split(".")[file.name.split(".").length - 1])) {
            setContactFile(file)
            sizeKo > convertionNumber ? setFileSize(sizeMo + " Mo") : setFileSize(sizeKo + " Ko")
            setFileTitle(file.name)
            setApercu(apercuExcel)
            setFileSelected(true)
            return true
        } else {
            reset()
            event.preventDefault()
            return false
        }

    }

    const endDrag = () => {
        setDetectDrop(false)
    }



    return (
        <div>
            <div>
                <div>
                    {success && <Info msg="Importation reusis" type="success" />}
                    {error && <Info msg="Une erreur est prevenue l'ors de l'importation" type="error" />}
                </div>
                <div className={`dropZone ${detectDrop ? "droping" : ""}`} {...props}>
                    <div className={`draggable`} onDrop={handleDrop} onDragOver={allowDrop} onDragLeave={endDrag}>
                        <div className="dragApercu">
                            <img src={apercu} className="dragImg" />
                            <p className="dragTitle">{fileTitle}</p>
                            <p className="dragSize">{fileSize}</p>
                        </div>
                        <input type="file" name="file" className="fileDrag" onChange={handleUpload} accept=".xlsx, .xls, .csv" />
                        <label for="fileDrag" className="fileDragLabel">{fileSelected ? "Changer le fichier" : "Importer les contacts"}</label>
                    </div>
                </div>
            </div>
            <br />
            <div className="end">
                <AnimateButton>
                    <Button
                        onClick={uploadToServer}
                        disabled={!fileSelected || loading}
                        disableElevation
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<UploadFileOutlined />}
                    >
                        {loading ? progess+"%" : "Sauvegarder les contacts"}
                    </Button>
                </AnimateButton>
            </div>
        </div>
    )
}