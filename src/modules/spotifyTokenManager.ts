const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

export default {
    getToken: async (auth_code: string) => {
        let response = null
        try{
            response = await fetch('https://accounts.spotify.com/api/token',{
                method: 'POST',
                body: new URLSearchParams({
                    code: `${auth_code}`,
                    redirect_uri: redirect_uri || '',
                    grant_type: 'authorization_code'
                }),
                headers:{
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
                }
            })
        } catch(err){
            console.log(err)
        }
        if(response && response.ok){
            response = await response.json();
            return response;
        }
        return null
    }
}