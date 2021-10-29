import http from "./http-common";

class UploadFileService {
	upload(file, requestID, onUploadProgress) {
		let formData = new FormData();
		formData.append("file",file);
		formData.append("requestID",requestID);
		return http.post("/imageClassify/upload/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			onUploadProgress,
		});
	}

	getInference(requestID) {
		return http.get("/imageClassify/infer/"+requestID);
	}
}

export default new UploadFileService();