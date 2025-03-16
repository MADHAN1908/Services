-- CREATE TABLE public.company (
--     company_id SERIAL PRIMARY KEY,
--     company_name VARCHAR(100) Not Null,
--     email VARCHAR(100) Not Null,
--     phone_no VARCHAR(20) Not Null,
--     address VARCHAR(255) Not Null,
--     city VARCHAR(50) Not Null,
-- 	state VARCHAR(50) Not Null,
-- 	country VARCHAR(50) Not Null,
--     postal_code VARCHAR(20) Not Null,
--     created_by INT Not Null REFERENCES public.users(userid),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE service.Ticket (
--     SR_id SERIAL PRIMARY KEY,
--     SR_Date TIMESTAMP Not Null,
--     SR_Desc VARCHAR(100) Not Null,
--     Machine VARCHAR(100) Not Null,
--     SR_Status VARCHAR(1) Not Null,
--     Priority VARCHAR(1) Not Null,
--     Service_Type VARCHAR(1) Not Null,
--     Company_id INT Not Null  REFERENCES public.company(company_id),
--     Contact_person INT Not Null REFERENCES public.users(userid),
--     Mode_of_Communication VARCHAR(1) Not Null,
--     Reported_date TIMESTAMP,
--     Created_By INT Not Null REFERENCES public.users(userid),
--     Assigned_to INT REFERENCES public.users(userid),
--     Assigned_by INT REFERENCES public.users(userid),
--     Assigned_date TIMESTAMP,
--     plan_in_Time TIMESTAMP,
--     Act_In_Time TIMESTAMP,
--     Act_Out_Time TIMESTAMP,
--     Customer_In_Time TIMESTAMP,
--     Customer_Out_Time TIMESTAMP,
--     Customer_Comment TEXT,
--     Customer_Rating INT
-- );

-- CREATE TABLE service.Solution (
--     solution_id SERIAL PRIMARY KEY,
--     SR_id INT NOT NULL REFERENCES service.ticket(sr_id),
--     Problem TEXT NOT NULL,
--     Before_Attachments JSON ,
--     After_Attachments JSON ,
--     Actions TEXT ,
--     Service_Status VARCHAR(1) ,
--     Status_Remark TEXT ,
--     Responsibility INT  REFERENCES public.users(userid) ,
--     Status_Date DATE ,
--     Customer_Acceptance BOOLEAN ,
--     Customer_Feedback TEXT,
-- 	created_by INT REFERENCES public.users(userid)
-- );

CREATE TABLE service.expenses (
    expense_id SERIAL PRIMARY KEY,
    sr_id INT NOT NULL REFERENCES service.ticket(sr_id),
	expense_type VARCHAR(1) Not Null,
	amount INT Not Null,
    attachments JSON ,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by INT REFERENCES public.users(userid)
);
