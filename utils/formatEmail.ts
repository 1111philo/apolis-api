export const formatEmail = ({ event, body }) => {
    return `<p><img style="width:200px;" src="https://${process.env.URL}/img/htic-logo.png"></p>
    Hey ${event?.request?.userAttributes?.name ?? 'user'},
    <p>${body}</p>
    <p>Thanks,
    <br/>Apolis</p>`;
};
