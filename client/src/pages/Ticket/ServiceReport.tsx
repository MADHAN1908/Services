import React, { forwardRef } from "react";
import { getServiceType,getStatus } from '../../utils/commonFunction';


const ServiceReport = forwardRef(({ ticket }: { ticket: any }, ref) => {
    if (!ticket) {
        return <p>No ticket data available</p>;
    }
    const ticketsArray = Array.isArray(ticket) ? ticket : [ticket];
    return (
               
<div ref={ref}  className="print-container hidden   print:block">
  <div className="">
  
    {ticketsArray &&
      ticketsArray.map((ticket , index) => (
        <div
          key={index}
          className={`max-w-4xl mx-auto  p-4 ${
            index !== 0 ? "page-break" : ""
          }`}
        >
          <div className="">
    <h2 className="text-center text-lg font-bold">
      VAMTEC MACHINES & AUTOMATION PRIVATE LIMITED
    </h2>
    <p className="text-center text-sm">
      270/4, Galaxy Company Road, Ayanambakkam, Chennai - 600 095.
    </p>
    <p className="text-center text-sm">
      Phone: 9171177915, Email: engg@vamtec.net
    </p>
    <div className="bg-green-500 text-white p-2 mt-4 text-center font-semibold">
      SERVICE REPORT
    </div>
  </div>
          {/* Ticket-specific details */}
          <table className="w-full border mt-4">
            <tbody>
              <tr>
                <td className="border p-2 font-semibold">
                  Customer: {ticket.company_name}
                </td>
                <td className="border p-2 font-semibold">
                  Date: {ticket.srf_date}
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">
                  Engineer Name: {ticket.assigned_to_name}
                </td>
                <td className="border p-2 font-semibold">
                  Machine: {ticket.machine}
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">
                  Service Type: {getServiceType(ticket.service_type)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Solutions Table */}
          <table className="w-full border mt-4">
            <thead className="table-header  ">
              <tr className="bg-gray-200 first-header pt-52">
                <th className="border p-2">Sl. No.</th>
                <th className="border p-2">Problem</th>
                <th className="border p-2">Actions</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Completion Date</th>
                <th className="border p-2">Status Remark</th>
                <th className="border p-2">Customer Remark</th>
              </tr>
            </thead>
            <tbody>
              {ticket.solutions && ticket.solutions.length > 0 ? (
                ticket.solutions.map((solution: any, i: number) => (<>
                
                  <tr key={solution.solution_id} className=''>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{solution.problem}</td>
                    <td className="border p-2">{solution.actions}</td>
                    <td className="border p-2">{getStatus(solution.status)}</td>
                    <td className="border p-2">{solution.completion_date}</td>
                    <td className="border p-2">{solution.status_remark}</td>
                    <td className="border p-2">{solution.customer_remark}</td>
                  </tr>
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="border p-2 text-center">
                    No solutions recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 border p-4">
            <p className="font-semibold">Customer's Comment:</p>
            <p>{ticket.customer_comment}.</p>
        </div>
        
        <div className="mt-4">
            <table className="w-full border">
                <tr>
                    <th className="border p-2">Contact Person Name</th>
                    <th className="border p-2">Reporting</th>
                    <th className="border p-2">Reported Time</th>
                    <th className="border p-2">Customer's Report Time</th>
                    <th rowSpan={3} className="border p-2 w-52 align-top "> <p className=" font-semibold">For VAMTEC Machines & Automation Pvt. Ltd</p></th>
                </tr>
                <tr>
                    <td rowSpan={2} className="border p-2 ">{ticket.contact_person_name}</td>
                    <td className="border p-2">In</td>
                    <td className="border p-2">{ticket.actf_in_time}</td>
                    <td className="border p-2">{ticket.customerf_in_time}</td>
                </tr>
                <tr>
                    <td className="border p-2">Out</td>
                    <td className="border p-2">{ticket.actf_out_time}</td>
                    <td className="border p-2">{ticket.customerf_out_time}</td>
                </tr>
            </table>
        </div>
        </div>
      ))}
  </div>
</div>

    );
});

export default ServiceReport;
