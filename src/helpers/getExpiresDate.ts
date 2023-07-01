function getExpiresDate(){
    let date = new Date(Date.now()+600000);
    
    const year = date.getFullYear();
    const month = addZero( date.getMonth() + 1 );
    const day = addZero( date.getDate() );
    const hr = addZero( date.getHours() );
    const min = addZero( date.getMinutes() );
    const sec = addZero( date.getSeconds() );

    const datetime = `${year}-${month}-${day} ${hr}:${min}:${sec}`;

    return datetime;
}

function addZero(num: number){ return num < 10 ? '0' + num : num }

export default getExpiresDate;