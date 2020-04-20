(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define("MyPlugin", [], factory);
    else if(typeof exports === 'object')
        exports["MyPlugin"] = factory();
    else
        root["MyPlugin"] = factory();
})(this, function () {
	function convertBase64UrlToBlob(urlData) {
		const bytes = window.atob(urlData.split(',')[1]) // ȥ��url��ͷ����ת��Ϊbyte
		// �����쳣,��ascii��С��0��ת��Ϊ����0
		const ab = new ArrayBuffer(bytes.length)
		const ia = new Uint8Array(ab)
		for (let i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i)
		}
		return new Blob([ab], { type: 'image/png' })
	}
	
	function compressUpload (fileObj, callback) {
		try {
			const image = new Image()
			image.src = window.URL.createObjectURL(fileObj)
			image.onload = function () {
				const that = this
				// Ĭ�ϰ�����ѹ��
				let w = that.width
				let h = that.height
				const scale = w / h
				w = fileObj.width || w
				h = fileObj.height || (w / scale)
				let quality = 0.7 // Ĭ��ͼƬ����Ϊ0.7
				// ����canvas
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
				// �������Խڵ�
				const anw = document.createAttribute('width')
				anw.nodeValue = w
				const anh = document.createAttribute('height')
				anh.nodeValue = h
				canvas.setAttributeNode(anw)
				canvas.setAttributeNode(anh)
				ctx.drawImage(that, 0, 0, w, h)
				// ͼ������
				if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
					quality = fileObj.quality
				}
				// qualityֵԽС�������Ƴ���ͼ��Խģ��
				const data = canvas.toDataURL('image/jpeg', quality)
				// ѹ�����ִ�лص�
				const newFile = convertBase64UrlToBlob(data)
				callback(newFile)
			}
		} catch (e) {
			console.log(e)
			console.log('ѹ��ʧ��!')
		}
	}
	
    return {
		'compressUpload': compressUpload
	}
})