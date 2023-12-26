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
import { Button, Stack } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios'
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';

export default function BasicTable() {

  const router = useRouter()

  const handleEdit = (additionalProp) => {
    router.push(`/users/editPage?additionalProp=${additionalProp}`);
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [active, setActive] = React.useState()

  const [value, setValue] = React.useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/userList/deleteUser?id=${id}`);
      
      if (response.data.success) {
        console.log(`Teacher with studentId ${id} deleted successfully.`);
         getData();
        // window.location.reload();

      } else {
        console.error('Delete request failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during delete request:', error.message);
    }
  };
  async function getData() {
    await fetch('http://localhost:3000/api/userList')
      .then((response) => response.json())
      .then((data) => setValue(data))
  }

  async function handleActive(index) {
    console.log(value.data[index])
    const response = await axios.post('http://localhost:3000/api/active', {
      status: !(value.data[index].status),
      studentId: value.data[index].studentId
    }).then({

    })
    // console.log(response)
    getData()
  }

  useEffect(() => {
  

    getData()
  }, [])


  var i = 0;
  return (
    
     <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={8} sm={8} md={8} lg={10} xl={12}>
        <TableContainer component={Paper} sx={{ borderRadius: '15px', overflowX: 'auto', minWidth: '100%', margin: '20px', marginLeft: 'auto', marginRight: 'auto', mr: { md: '4rem', sm: '4rem' } }}>
          <Table aria-label="simple table" stickyHeader={true}>
            <TableHead>
              <TableRow>
                <TableCell><b>Student No.</b></TableCell>
                <TableCell align='left'><b>Student Name</b></TableCell>
                <TableCell align="left"><b>StudentID&nbsp;(email)</b></TableCell>
                <TableCell align="left"><b>Level</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
                <TableCell align="center"><b>Edit</b></TableCell>
                <TableCell align="center"><b>Delete</b></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {value?.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((curElem, index) => {
                  const rowIndex = page * rowsPerPage + index + 1;
                  return (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="curElement" align='center'>
                        {rowIndex}
                      </TableCell>
                      <TableCell align="left" sx={{ fontFamily: "inherit" }}>{curElem.studentName}</TableCell>
                      <TableCell align="left" sx={{ fontFamily: 'inherit' }}>{curElem.studentId}</TableCell>
                      <TableCell align="left" sx={{ fontFamily: "inherit" }}>{curElem.level}</TableCell>
                      <TableCell align="left" sx={{ fontFamily: "inherit" }}>
                        <Button disabled={false} variant="outlined" style={{ color: "#5c0931", borderColor: "#5c0931" }} onClick={() => handleActive(index)}>
                          {curElem.status ? "Active" : "Inactive"}
                        </Button>
                      </TableCell>
                      <TableCell align="left" sx={{ fontFamily: "inherit" }}>
                        <Stack flexDirection='row'>
                          <Button onClick={() => handleEdit(curElem.studentId)}>
                            <EditIcon sx={{ color: '#5c0931' }} />
                          </Button>
                        </Stack>
                        
                      </TableCell>
                      <TableCell align="left" sx={{ fontFamily: "inherit" }}>
                        <Stack flexDirection='row'>
                          <Button onClick={() => handleDelete(curElem._id)}>
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
          count={value && value.data ? value.data.length : 0}
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
//     const res = await axios.get('http://localhost:3000/api/userList');
//     console.log(res.data)
//     const data = res.data;
//     return { data };
//   } catch (error) {
//     return { error };
//   }
// };
