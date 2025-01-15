const decoder = new TextDecoder("utf-8");

export default (response, resultParsing, callback) => {
    if (response.ok) {
        const reader = response.body.getReader();
        let buffer = "";  // 缓冲区
        let reading = true;  // 添加一个标志位
        // 读取流
        const readStream = () => {
            reader
                .read()
                .then(({ done, value }) => {
                    if (done) {
                        if (!reading) return;
                        if (callback != null) {
                            callback({
                                err: null,
                                text: "",
                                done: true,
                            });
                        }
                        return; // 结束流
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk; // 把当前 chunk 添加到缓冲区
                    // 处理接收到的多个数据段
                    //console.log(chunk)
                    // 处理接收到的多个数据段
                    const events = buffer.split(/\n\s*\n/); // 使用缓冲区中的数据分割事件
                    buffer = events.pop(); // 最后一个可能是不完整的数据段，留在缓冲区里
                    // const events = chunk.split(/\n\s*\n/);
                    events.forEach((event) => {
                        if (event.startsWith("data: [DONE]")) {
                            reading = false;  // 设置标志位为 false
                            if (callback != null) {
                                callback({
                                    err: null,
                                    text: "",
                                    done: true,
                                });
                            }
                            return; // 结束流
                        } else if (event.startsWith("data:")) {
                            const jsonData = event.substring(5).trim();
                            try {
                                const parsedData = JSON.parse(jsonData);
                                resultParsing(parsedData, callback);
                                //console.log(parsedData)
                            } catch (error) {
                                //console.log(event)
                                callback({
                                    err: error,
                                    text: "",
                                    done: false,
                                });
                            }
                        } else if (event.startsWith("error:")) {
                            const jsonData = event.substring(6).trim();
                            try {
                                const parsedData = JSON.parse(jsonData);
                                callback({
                                    err: parsedData,
                                    text: "",
                                    done: false,
                                });
                            } catch (error) {
                                console.log(event)
                                callback({
                                    err: error,
                                    text: "",
                                    done: false,
                                });
                            }
                        }
                    });
                    if (reading) {
                        readStream();
                    }
                })
                .catch((error) => {
                    callback({
                        err: error,
                        text: "",
                        done: true,
                    });
                });
        };
        readStream(); // 开始读取
    } else {
        callback({
            err: response.status + ":" + response.statusText,
            text: "",
            done: true,
        });
    }
};