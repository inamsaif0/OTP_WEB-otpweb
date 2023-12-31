import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import useSWR from 'swr';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Stack } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios'
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import Cookies from 'js-cookie';
import CancelIcon from '@mui/icons-material/Cancel';

export default function BasicTable() {

    const router = useRouter()
    async function getData() {
        const email = Cookies.get('userEmail');
        const role = Cookies.get('userRole');

        if (role === 'teacher') {
            let data = await fetch(`/api/audio/getAudio?email=${email}`)
                .then((response) => response.json())
                .then((data) => setValue(data))

            return data;
        }
        else {
            let data = await fetch(`/api/audio/getAllAudios`)
                .then((response) => response.json())
                .then((data) => setValue(data))

            return data;
        }
    }

    // const handleEdit = (additionalProp) => {
    //     router.push(`/teachers/editTeacher?additionalProp=${additionalProp}`);
    // }
    const deleteAudio = async (id) => {
        // console.log(id, 'sssss')
        try {
            const response = await axios.post(`/api/audio/deleteAudio`, {
                id: id
            });
            getData();
            if (response.data.success) {
                // getData();
                console.log(`Audio with studentId ${id} deleted successfully.`);



            } else {
                console.error('Audio request failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error during delete request:', error.message);
        }
    };


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [active, setActive] = React.useState()

    const [value, setValue] = React.useState();
    const [message, setMessage] = React.useState('');
    const [messageReject, setMessageReject] = React.useState('');


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    async function getData() {
        const email = Cookies.get('userEmail');
        const role = Cookies.get('userRole');

        if (role === 'teacher') {
            let data = await fetch(`/api/audio/getAudio?email=${email}`)
                .then((response) => response.json())
                .then((data) => setValue(data))

            return data;
        }
        else {
            let data = await fetch(`/api/audio/getAllAudios`)
                .then((response) => response.json())
                .then((data) => setValue(data))

            return data;
        }
    }

    async function handleActive(index) {
        console.log(value.data[index])
        const response = await axios.post('/api/active', {
            status: !(value.data[index].status),
            studentId: value.data[index].studentId
        }).then({

        })
        // console.log(response)
        getData()
    }
    const handleUpdateStatus = async (id, status) => {
        //   setMessage('Rejected');

        try {
            // Replace '' with your actual backend URL
            const response = await axios.post('/api/audio/editAudio', {
                _id: id,
                status: status
            });
            getData()
            console.log(response.data); // Log the response from the server
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleCancelClick = () => {
        setMessage('Rejected');

    };

    const handleCheckCircleClick = () => {
        setMessage('Accepted');
    };

    const handleDeleteClick = () => {
        setMessage('Delete clicked!');
    };

    useEffect(() => {


        getData()
    }, [])


    var i = 0;
    return (

        <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={8} sm={8} md={8} lg={10} xl={12}>
                <TableContainer component={Paper} sx={{ borderRadius: '15px', overflowX: 'auto', minWidth: '100%', margin: '20px', marginLeft: 'auto', mr: { md: '4rem', sm: '4rem' } }}>
                    <Table aria-label="simple table" stickyHeader={true}>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Teacher No.</b></TableCell>
                                <TableCell align='left'><b>Audio Link</b></TableCell>
                                <TableCell align="left"><b>TeacherID&nbsp;(email)</b></TableCell>
                                <TableCell align="left"><b>Student</b></TableCell>
                                {/* <TableCell align="center"><b>Status</b></TableCell> */}
                                <TableCell align="center"><b>Options</b></TableCell>
                                <TableCell align="center"><b>Delete</b></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {value?.result
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((curElem, index) => {
                                    const rowIndex = page * rowsPerPage + index + 1;
                                    return (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="curElement" align='center'>
                                                {rowIndex}
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontFamily: "inherit" }}>
                                                <a style={{ color: '#5c0931' }} href={curElem.audioLink} target="_blank" rel="noopener noreferrer">
                                                    {curElem.name}
                                                </a>
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontFamily: 'inherit' }}>{curElem.teacherEmail}</TableCell>
                                            <TableCell align="left" sx={{ fontFamily: "inherit" }}>{curElem.ownerEmail}</TableCell>
                                            {/* <TableCell align="left" sx={{ fontFamily: "inherit" }}>
                        <Button disabled={false} variant="outlined" style={{ color: "#5c0931", borderColor: "#5c0931" }} onClick={() => handleActive(index)}>
                          {curElem.status ? "Active" : "Inactive"}
                        </Button>
                      </TableCell> */}
                                            {/* <TableCell align="left" sx={{ fontFamily: "inherit" }}>
                        <Stack flexDirection='row'>
                          <Button onClick={() => handleEdit(curElem.email)}>
                            <EditIcon sx={{ color: '#5c0931' }} />
                          </Button>
                        </Stack>
                      </TableCell> */}
                                            <TableCell align="left" sx={{ fontFamily: 'inherit' }}>
                                                <Stack flexDirection="row" justifyContent="center">
                                                    {curElem.status ? <b>{curElem.status}</b> :
                                                        <>
                                                            <Button onClick={() => handleUpdateStatus(curElem._id, status = "Rejected")}>
                                                                <CancelIcon sx={{ color: '#5c0931' }} />
                                                            </Button>
                                                            <Button onClick={() => handleUpdateStatus(curElem._id, status = "Accepted")}>
                                                                {/* {message ? message : } */}
                                                                <CheckCircleIcon sx={{ color: '#5c0931' }} />
                                                            </Button>
                                                        </>}

                                                </Stack>
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontFamily: 'inherit' }}>
                                                <Stack flexDirection="row" justifyContent="center">
                                                    <Button onClick={() => {
                                                        deleteAudio(curElem._id)
                                                    }}>
                                                        <DeleteIcon sx={{ color: '#5c0931' }} />
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={10} xl={12}>
                <TablePagination
                    rowsPerPageOptions={[5, 25, 100]}
                    component="div"
                    count={value && value.result ? value.result.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>


    );
}
// BasicTable.getInitialProps = async ctx => {
//   try {
//     const res = await axios.get('/api/userList');
//     console.log(res.data)
//     const data = res.data;
//     return { data };
//   } catch (error) {
//     return { error };
//   }
// };
