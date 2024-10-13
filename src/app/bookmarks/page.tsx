
export interface TResData {
    userId: string;
    id:     string;
    title:  string;
    body:   string;
}

const getData = async(url: string) => {
    const x = await fetch(url);
    const resData = await x.json();
    
    if(!resData){
        return <p>Loading....</p>
    }
    console.log(resData);
    return resData;
}

const bookmarks = async () => {
    const resData = await getData("https://jsonplaceholder.typicode.com/posts");

    return (
        <div className='pt-20'>
            <h1>Here&apos;s these data</h1>
            {
                resData?.map((item: TResData) => (<div key={item?.id} className='w-1/2 border-solid border-2'>
                        <h1>{item?.userId}</h1>
                        <h1>{item?.title}</h1>
                        <p>{item?.body}</p>
                    </div>)
                )
            }
        </div>
    );
};

export default bookmarks;