const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const ticketModel = require('../../model/ticketModel');
const pgsdb = require('../../library/pgsdb');
const db = new pgsdb();

const getReport = async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    const result = await ticketModel.getReport(id);

    const tickets = result;
    const html = await ejs.renderFile(path.join(__dirname, '../../view/reportTemplate.ejs'), { tickets,getStatus,getServiceType });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfPath = path.join(__dirname, '../report.pdf');
    await page.pdf({ path: pdfPath, format: 'A4',printBackground: true });
    await browser.close();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'alert.vamtec@gmail.com',
          pass: 'mbmb chvd micr dwki'
        }
      });

      await transporter.sendMail({
        from: 'alert.vamtec@gmail.com',
        to: 'madhanperumal1908@gmail.com',
        subject: 'Your PDF Report',
        text: 'Attached is your requested PDF report.',
        attachments: [{ filename: 'report.pdf', path: pdfPath }]
      });
  
      res.status(200).json({ message: 'Email with PDF sent!' ,'response': 'Success', 'CloseTickets': tickets });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
}

const getMailReport = async (id) => {
    try {
    const tickets = await ticketModel.getReport(id);
    const ticket = tickets[0];
    const report_emails = await db.raw('select * from public.report_emails');
    const html = await ejs.renderFile(path.join(__dirname, '../../view/reportTemplate.ejs'), { tickets,getStatus,getServiceType });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfPath = path.join(__dirname, '../../view/report.pdf');
    await page.pdf({ path: pdfPath, format: 'A4',printBackground: true });
    await browser.close();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'alert.vamtec@gmail.com',
          pass: 'mbmb chvd micr dwki'
        }
      });

      await transporter.sendMail({
        from: 'alert.vamtec@gmail.com',
        to:  `${ticket.customer_email}`,
        cc: `${report_emails[0].emails},${ticket.assigned_by_email},${ticket.assigned_to_email}`,
        subject: 'Sending the Service report Details',
        text: `Service Report Details of Service Request ID :${ticket.sr_id}. `,
        attachments: [{ filename: 'report.pdf', path: pdfPath }]
      });
  
      return 'Success';
  
    } catch (error) {
      console.error(error);
      return 'Error';
    }
}

const getServiceType = (type) => {
    switch (type) {
        case 'W':
        return 'Warranty';
      case 'B':
        return 'BreakDown';
      case 'M':
        return 'Maintenance';
    }
};

const getStatus = (status) => {
    switch (status) {
        case 'X':
        return 'Unassigned';
      case 'P':
        return 'Pending';
      case 'W':
        return 'In Progress';
      case 'C':
        return 'Completed';
      case 'A':
        return 'Customer Approved';
      case 'Y':
        return 'All Completed';
      case 'Z':
        return 'Closed'; 
    }
};






module.exports = {
    getReport,
    getMailReport,
    
}