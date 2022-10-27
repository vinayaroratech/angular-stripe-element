import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

declare var Stripe: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  paymentHandler: any = null;
  private _apiKey =
    'pk_test_51LnJeKHk6RkyXGW3UfaBqc8sd1JBK6cOB612i0fsw0O8z24wBzx4m1VRe8d3bnqLw0OA2ObzPWezqOfOQ74ravBn00FOOWvWWO';
  constructor() {}

  ngOnInit() {
    // this.invokeStripe();
    this.createStripeElement();
  }

  createStripeElement() {
    // Your Stripe public key
    const stripe = Stripe(this._apiKey);

    // Create `card` element that will watch for updates
    // and display error messages
    const appearance = {
      theme: 'stripe',
    };
    const clientSecret = '';
    const elements = stripe.elements({
      fonts: [
        {
          cssSrc: 'https://rsms.me/inter/inter.css',
        },
      ],
    });
    const card = elements.create('card', {
      style: {
        base: {
          color: '#32325D',
          fontWeight: 500,
          fontFamily: 'Inter, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#CFD7DF',
          },
        },
        invalid: {
          color: '#E25950',
        },
      },
    });
    card.mount('#card-element');
    card.addEventListener('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError!.textContent = event.error.message;
      } else {
        displayError!.textContent = '';
      }
    });

    var paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        amount: 2000,
        label: 'Total',
      },
    });

    // Listen for form submission, process the form with Stripe,
    // and get the
    const paymentForm = document.getElementById('payment-form');
    paymentForm!.addEventListener('submit', (event) => {
      event.preventDefault();
      stripe.createToken(card).then((result: any) => {
        if (result.error) {
          console.log('Error creating payment method.');
          const errorElement = document.getElementById('card-errors');
          errorElement!.textContent = result.error.message;
        } else {
          // At this point, you should send the token ID
          // to your server so it can attach
          // the payment source to a customer
          console.log('Token acquired!');
          console.log(result.token);
          console.log(result.token.id);
        }
      });
    });
  }

  makePayment(amount: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this._apiKey,
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
        alert('Stripe token generated!');
      },
    });
    paymentHandler.open({
      name: 'Positronx',
      description: '3 widgets',
      amount: amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51LnJeKHk6RkyXGW3UfaBqc8sd1JBK6cOB612i0fsw0O8z24wBzx4m1VRe8d3bnqLw0OA2ObzPWezqOfOQ74ravBn00FOOWvWWO',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
