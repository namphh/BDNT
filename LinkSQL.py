import mariadb
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
import uvicorn
import requests

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BDNT:
    def __init__(self, user, password, host, port, database) -> None:
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.database = database
        self.connect = None
        self.cur = None

    def connect_SQL(self):
        try:
            self.connect = mariadb.connect(
                user=self.user,
                password=self.password,
                host=self.host,
                port=int(self.port),
                database=self.database
            )
            self.cur = self.connect.cursor()
        except mariadb.Error as e:
            return 101
        return 201

    def disconnect_SQL(self):
        if self.cur:
            self.cur.close()
        if self.connect:
            self.connect.close()
            print("MariaDB connection is closed")

# Initialize BDNT instance without credentials initially
bdnt_instance = BDNT("", "", "", "", "")

@app.post("/connect_db")
async def connect_db(
    user: str = Form(...), 
    password: str = Form(...), 
    host: str = Form(...),
    port: str = Form(...),
    database: str = Form(...)
):
    # Update the BDNT instance with the form data
    bdnt_instance.user = user
    bdnt_instance.password = password
    bdnt_instance.host = host
    bdnt_instance.port = port
    bdnt_instance.database = database
    
    # Connect to the database
    status = bdnt_instance.connect_SQL()
    
    return {"status": status}

@app.get("/top_10_provinces_errors")
async def top_10_provinces_errors():

    bdnt_instance.connect_SQL()

    query = '''
    SELECT 
    R.station_code,
    COUNT(DISTINCT R.request_id) AS Num_Fail
    FROM 
        requests_info R
    JOIN 
        tasks_result T ON R.request_id = T.request_id
    WHERE 
        R.request_id IN (
            SELECT request_id 
            FROM tasks_result 
            GROUP BY request_id 
            HAVING MIN(result) = 0
        )
    GROUP BY 
        R.station_code
    ORDER BY 
        Num_Fail DESC
    LIMIT 10;
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (station_code, Num_Error) in bdnt_instance.cur:
        results.append({
            "station_code": station_code,
            "Num_Error": Num_Error
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/num_rq_monitor")
async def num_rq_monitor():
    bdnt_instance.connect_SQL()

    query = '''
    SELECT MONTH(R.created_at) AS MONTH_ID, COUNT(R.request_id) AS Num_RQ FROM requests_info R
    WHERE MONTH(R.created_at)
    GROUP BY MONTH(R.created_at)
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (MONTH_ID, Num_RQ) in bdnt_instance.cur:
        results.append({
            "MONTH_ID": MONTH_ID,
            "Num_RQ": Num_RQ
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/num_station_monitor")
async def num_station_monitor():
    bdnt_instance.connect_SQL()

    query = '''
    SELECT MONTH(R.created_at) AS MONTH_ID, COUNT(R.station_code) AS Num_station FROM requests_info R
    WHERE MONTH(R.created_at)
    GROUP BY MONTH(R.created_at)
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (MONTH_ID, Num_station) in bdnt_instance.cur:
        results.append({
            "MONTH_ID": MONTH_ID,
            "Num_station": Num_station
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/num_rq_pass_per_month")
async def num_rq_pass_per_month():
    bdnt_instance.connect_SQL()

    query = '''
    SELECT 
    MONTH(R.created_at) AS MONTH_ID, 
    COUNT(DISTINCT CASE 
        WHEN T.request_id NOT IN (
            SELECT request_id 
            FROM tasks_result 
            GROUP BY request_id 
            HAVING MIN(result) = 0
        ) THEN R.request_id END) AS Num_Pass
    FROM 
        requests_info R
    JOIN 
        tasks_result T ON R.request_id = T.request_id
    GROUP BY 
        MONTH_ID;
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (MONTH_ID, Num_Pass) in bdnt_instance.cur:
        results.append({
            "MONTH_ID": MONTH_ID,
            "Num_Pass": Num_Pass
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/num_rq_fail_per_month")
async def num_rq_fail_per_month():
    bdnt_instance.connect_SQL()

    query = '''
    SELECT 
    MONTH(R.created_at) AS MONTH_ID, 
    COUNT(DISTINCT CASE 
        WHEN T.request_id IN (
            SELECT request_id 
            FROM tasks_result 
            GROUP BY request_id 
            HAVING MIN(result) = 0
        ) THEN R.request_id END) AS Num_Fail
    FROM 
        requests_info R
    JOIN 
        tasks_result T ON R.request_id = T.request_id
    GROUP BY 
        MONTH_ID;
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (MONTH_ID, Num_fail) in bdnt_instance.cur:
        results.append({
            "MONTH_ID": MONTH_ID,
            "Num_fail": Num_fail
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/num_rq_per_month")
async def num_rq_per_month():
    bdnt_instance.connect_SQL()

    query = '''
    SELECT 
    MONTH(R.created_at) AS MONTH_ID, 
    COUNT(DISTINCT CASE 
        WHEN T.request_id NOT IN (
            SELECT request_id 
            FROM tasks_result 
            GROUP BY request_id 
            HAVING MIN(result) = 0
        ) THEN R.request_id END) AS Num_Pass, -- request_id đạt
    COUNT(DISTINCT CASE 
        WHEN T.request_id IN (
            SELECT request_id 
            FROM tasks_result 
            GROUP BY request_id 
            HAVING MIN(result) = 0
        ) THEN R.request_id END) AS Num_Fail, -- request_id không đạt
    COUNT(DISTINCT R.request_id) AS Total_request -- Tổng số request_id trong tháng
    FROM 
        requests_info R
    JOIN 
        tasks_result T ON R.request_id = T.request_id
    GROUP BY 
        MONTH_ID;
    '''
    bdnt_instance.cur.execute(query)
    # for (request_month, passed_requests, failed_requests, total_requests) in bdnt_instance.cur:
    #     print(request_month, passed_requests, failed_requests, total_requests)
    results = []
    for (request_month, passed_requests, failed_requests, total_requests) in bdnt_instance.cur:
        results.append({
            "request_month": request_month,
            "passed_requests": passed_requests,
            "failed_requests": failed_requests,
            "total_requests": total_requests
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/top_10_object_station_errors")
async def top_10_object_station_errors():
    bdnt_instance.connect_SQL()

    query = '''
    SELECT 
    R.object_station_name, 
    COUNT(DISTINCT CASE 
        WHEN T.request_id IN (
            SELECT request_id 
            FROM tasks_result 
            GROUP BY request_id 
            HAVING MIN(result) = 0
        ) THEN R.request_id END) AS Num_Fail
    FROM 
        requests_info R
    JOIN 
        tasks_result T ON R.request_id = T.request_id
    GROUP BY 
      R.object_station_name
    ORDER BY Num_Fail DESC
    LIMIT 10
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (object_station_name, Num_Pass) in bdnt_instance.cur:
        object_station_name = object_station_name.replace('_', ' ')
        results.append({
            "object_station_name": object_station_name,
            "Num_Pass": Num_Pass
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/top_10_task_errors")
async def top_10_task_errors():
    
    bdnt_instance.connect_SQL()

    query = '''
    SELECT h.task_name, COUNT(T.result) AS Num_error
    FROM tasks_result T
    JOIN html h on T.task_code = h.task_code
    WHERE T.result = 0
    GROUP BY T.task_code
    ORDER BY Num_error DESC
    LIMIT 10
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (task_name, Num_error) in bdnt_instance.cur:
        results.append({
            "task_code": task_name,
            "Num_error": Num_error
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/html_object")
async def html_object():
    
    bdnt_instance.connect_SQL()

    query = '''
    SELECT distinct(h.infra_object)
    FROM html h
    JOIN tasks_result t ON h.task_code = t.task_code
    JOIN requests_info r ON r.request_id = t.request_id
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (infra_object) in bdnt_instance.cur:
        results.append({
            "html_object": infra_object
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/html_type")
async def html_type():
    
    bdnt_instance.connect_SQL()

    query = '''
    SELECT distinct(h.infra_type)
    FROM html h
    JOIN tasks_result t ON h.task_code = t.task_code
    JOIN requests_info r ON r.request_id = t.request_id
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (infra_type) in bdnt_instance.cur:
        results.append({
            "html_type": infra_type
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/object_station")
async def object_station_name():
    
    bdnt_instance.connect_SQL()

    query = '''
    SELECT distinct(h.object_station_name)
    FROM html h
    JOIN tasks_result t ON h.task_code = t.task_code
    JOIN requests_info r ON r.request_id = t.request_id
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (object_station_name) in bdnt_instance.cur:
        results.append({
            "object_station_name": object_station_name
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/task_code")
async def task_code():
    
    bdnt_instance.connect_SQL()

    query = '''
    SELECT distinct(h.task_name)
    FROM html h
    JOIN tasks_result t ON h.task_code = t.task_code
    JOIN requests_info r ON r.request_id = t.request_id
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (task_name) in bdnt_instance.cur:
        results.append({
            "task_code": task_name
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/station_code")
async def station_code():
    
    bdnt_instance.connect_SQL()

    query = '''
    SELECT distinct(r.station_code)
    FROM html h
    JOIN tasks_result t ON h.task_code = t.task_code
    JOIN requests_info r ON r.request_id = t.request_id
    ORDER BY r.station_code ASC
    '''
    bdnt_instance.cur.execute(query)

    results = []
    for (station_code) in bdnt_instance.cur:
        results.append({
            "station_code": station_code
        })
    
    bdnt_instance.disconnect_SQL()

    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.get("/query_all_html")
async def query_all_html(
    # html_type: str = Form(None), 
    # html_object: str = Form(None), 
    # object_station: str = Form(None), 
    # task_code: str = Form(None), 
):
    # Chuyển đổi chuỗi trống thành None
    html_type = None 
    html_object = None
    object_station = None
    problem = None

    bdnt_instance.connect_SQL()
    
    query = '''
    SELECT 
        h.infra_type, 
        h.infra_object, 
        h.object_station_name, 
        h.task_name
    FROM 
        html h
    JOIN 
        tasks_result t ON h.task_code = t.task_code
    JOIN 
        requests_info r ON r.request_id = t.request_id
    WHERE
        (%s IS NULL OR h.infra_type = %s) AND
        (%s IS NULL OR h.infra_object = %s) AND
        (%s IS NULL OR h.object_station_name = %s) AND
        (%s IS NULL OR h.task_name = %s);
    '''

    params = (
        html_type, html_type, 
        html_object, html_object, 
        object_station, object_station, 
        problem, problem
    )
    
    bdnt_instance.cur.execute(query, params)

    # Lấy kết quả từ truy vấn
    results = []
    for (infra_type, infra_object, object_station_name, problem) in bdnt_instance.cur:
        results.append({
            "html_type": infra_type,
            "html_object": infra_object,
            "object_station_name": object_station_name,
            "task_code": problem
        })
    
    bdnt_instance.disconnect_SQL()

    # Trả về kết quả
    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.post("/query_all")
async def query_all(
    html_type: str = Form(None), 
    html_object: str = Form(None), 
    object_station: str = Form(None), 
    problem: str = Form(None), 
    station_code: str = Form(None), 
    time: str = Form(None), 
    result: str = Form(None), 
    acc: str = Form(None)
):
    # Chuyển đổi chuỗi trống thành None
    html_type = None if html_type == "isempty" else html_type
    html_object = None if html_object == "isempty" else html_object
    object_station = None if object_station == "isempty" else object_station
    problem = None if problem == "isempty" else problem
    station_code = None if station_code == "isempty" else station_code
    time = None if time == "isempty" else time
    result = None if result == "isempty" else result
    acc = None if acc == "isempty" else acc

    bdnt_instance.connect_SQL()
    
    query = '''
    SELECT 
        h.infra_type, 
        h.infra_object, 
        h.object_station_name,
        t.request_id,
        h.task_code,
        h.task_name, 
        r.station_code, 
        r.created_at,
        t.result, 
        t.confidence_score,
        CASE 
            WHEN t.urls_success <> '[]' THEN t.urls_success
            ELSE t.urls_fail
        END AS urls
    FROM 
        html h
    JOIN 
        tasks_result t ON h.task_code = t.task_code
    JOIN 
        requests_info r ON r.request_id = t.request_id
    WHERE
        (%s IS NULL OR h.infra_type = %s) AND
        (%s IS NULL OR h.infra_object = %s) AND
        (%s IS NULL OR h.object_station_name = %s) AND
        (%s IS NULL OR h.task_name = %s) AND
        (%s IS NULL OR r.station_code = %s) AND
        (%s IS NULL OR r.created_at >= %s) AND
        (%s IS NULL OR t.result = %s) AND
        (%s IS NULL OR t.confidence_score >= %s);
    '''

    params = (
        html_type, html_type, 
        html_object, html_object, 
        object_station, object_station, 
        problem, problem, 
        station_code, station_code, 
        time, time, 
        result, result, 
        acc, acc
    )
    
    bdnt_instance.cur.execute(query, params)

    # Lấy kết quả từ truy vấn
    results = []
    for (infra_type, infra_object, object_station_name, request_id, task_code, task_name, station_code, created_at, result, confidence_score, urls) in bdnt_instance.cur:
        # print(created_at.isoformat().split("T")[0])
        result = 'Pass' if result == 1 else 'Fail'
        if confidence_score == 0:
            confidence_score = '100%'
        else:
            confidence_score = f"{round(confidence_score, 2)}%"
        results.append({
            "html_type": infra_type,
            "html_object": infra_object,
            "object_station_name": object_station_name,
            "request_id": request_id,
            "task_ID": task_code,
            "task_code": task_name,
            "station_code": station_code,
            "created_at": created_at.isoformat().split("T")[0],  # Chuyển đổi thành chuỗi ISO
            "result": result,
            "confidence_score": confidence_score,
            "urls": urls
        })
    
    bdnt_instance.disconnect_SQL()

    # Trả về kết quả
    response = {
        "data": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.post("/login")
def login(
    username: str = Form(None), 
    password: str = Form(None), 
):  
    print(username, password)
    url = 'https://10.255.58.201:8002/sso/v1/tickets'
    url_new = url + '?' + 'username=' + str(username) + '&' + 'password=' + str(password) + '&token=true'
    print(url_new)
    
    payload = {
    }

    headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    # Make the POST request (ignoring SSL certificate warnings)
    response = requests.post(url_new, headers=headers, verify=False)

    # Check for successful response
    if response.status_code == 201:
        results = 201
    else:
        results = 101

    response = {
        "status_code": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)

@app.post("/get_results")
def get_results(
    request_id: str = Form(None), 
    task_code: str = Form(None), 
):
    print(request_id, task_code)
    url = "http://10.254.139.26:8091/api/icms/result"
    
    # Parameters for the request
    payload = {
        'request_id': request_id,
        'password': task_code,
    }


    # Make the POST request (ignoring SSL certificate warnings)
    response = requests.post(url, data=payload, verify=False)

    # Check for successful response
    if response.images:
        results = response.images
    else:
        results = ''

    response = {
        "status_code": results,
        "msg": "success",
        "code": 200
    }

    return JSONResponse(content=response)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    