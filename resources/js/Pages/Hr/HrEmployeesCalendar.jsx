import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormGroup, IconButton, InputLabel, Typography } from '@mui/material';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import '../../../../resources/css/calendar.css'
import moment from 'moment';

const HrEmployeesCalendar = () => {
    const [getEvents, setGetEvents] = useState([]);
    const [currentEvents, setCurrentEvents] = useState([]);
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));


    useEffect(() => {
        axiosInstance.get('/get_events', { headers }).then((response) => {
            setGetEvents(response.data.events);
        });
    }, [])


    const handleDateSelect = (selectInfo) => {
        let startDate = selectInfo.startStr;
        let endDate = selectInfo.endStr;
        let start_dates = []
        let end_dates = []
        const color = 'rgb(0, 128, 24)';
        
        while(moment(startDate) < moment(endDate)){
            start_dates.push(startDate);
            startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
          }
        
        start_dates.forEach(endDates => {
            end_dates.push(moment(endDates).add(1, 'days').format("YYYY-MM-DD"));
        });
        // let calendarApi = selectInfo.view.calendar
        // calendarApi.addEvent({
        //     id: createEventId(),
        //     title: 'On Duty',
        //     start: selectInfo.startStr,
        //     end: selectInfo.endStr,
        //     allDay: selectInfo.allDay
        // })
        // calendarApi.unselect()

        new Swal({
            title: "Are you sure?",
            text: "Confirm to Add this to Work Day?",
            icon: "warning",
            allowOutsideClick: false,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post(`/add_event`, {
                    title: 'Work Day',
                    start: start_dates,
                    end: end_dates,
                    color: color
                }, { headers }).then(function (response) {
                    if (response.data.message = 'Success') {
                        location.reload();
                    } else {
                        alert('Please Try Again');
                        location.reload();
                    }
                })
            } else {
                location.reload()
            }
        });
    }

    const handleEventClick = (clickInfo) => {
        new Swal({
            title: "Are you sure?",
            text: "Confirm to Delete this Work day?",
            icon: "warning",
            allowOutsideClick: false,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post(`/delete_events`, { eventID: clickInfo.event.id }, { headers }).then(function (response) {
                    if (response.data.deleteData = 'Success') {
                        location.reload();
                    } else {
                        alert('Please Try Again');
                        location.reload();
                    }
                })
            } else {
                location.reload()
            }
        });
    }

    const handleEvents = (events) => {
        setCurrentEvents(events)
    }

    return (
        <Layout title={"Employees Calendar"}>
            <div className="content-heading d-flex justify-content-between p-0">
                <h5 className='pt-3'>Work Days</h5>
            </div>
            <div className="block" >
                <div className="block-content">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'title',
                            right: 'prev,next today'
                        }}
                        // dayGridMonth ,timeGridWeek,timeGridDay
                        initialView='dayGridMonth'
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        editable={false}
                        contentHeight={700}
                        displayEventTime={false}
                        // selectAllow={function (select) {
                        //     return moment().diff(select.start, 'days') <= 0
                        // }}
                        events={getEvents} // alternatively, use the `events` setting to fetch from a feed
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        eventsSet={handleEvents}
                        showNonCurrentDates={false}
                    // called after events are initialized/added/changed/removed
                    /* you can update a remote database when these fire:
                    eventAdd={function(){}}
                    eventChange={function(){}}
                    eventRemove={function(){}}
                    */
                    />
                </div>
            </div>

        </Layout>
    )
}

export default HrEmployeesCalendar