// JavaScript to handle the Instructions modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('instructions-modal');
    const btn = document.getElementById('instructions-btn');
    const span = document.getElementsByClassName('close')[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow background scrolling
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Allow background scrolling
        }
    }
});
