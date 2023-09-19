import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { IChain } from 'src/app/interfaces/crypto.interface';
import { CryptoService } from 'src/app/services/crypto.service';
import { Subscription } from 'rxjs'
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {
  provider!: any;
  currentAccount = '';
  chainId = '';
  chains: IChain[] = [];
  filteredChains: IChain[];

  subscription = new Subscription();

  cryptoForm = new FormGroup({
    chainControl: new FormControl('', Validators.required),
    recipientAddressControl: new FormControl('', Validators.required),
    amountControl: new FormControl('', Validators.required)
  })

  constructor(private cryptoService: CryptoService, private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.cryptoService.getAllChain().subscribe((res: IChain[]) => {
      this.chains = res;
      this.filteredChains = res;
    });

    this.subscription = this.cryptoForm.get('chainControl').valueChanges.subscribe(
      res => {
        this._filter(res || '');
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private _filter(data: string | IChain) {
    const filterValue = typeof data === 'string' ? data.toLowerCase() : data.name.toLowerCase();
    this.filteredChains = this.chains.filter(chain => chain.name.toLowerCase().includes(filterValue));
  }

  displayFn(chain: IChain): string {
    return chain.name;
  }

  async submit() {
    const provider = await detectEthereumProvider();

    if (!provider) {
      alert('MetaMask not found');
      return;
    }

    const ethProvider = new ethers.providers.Web3Provider(provider);

    this.send(ethProvider);
  }

  private async send(provider: ethers.providers.Web3Provider) {
    const signer = provider.getSigner();
    const decimalChainId = +this.chainId;

    try {
      await provider.send('eth_chainId', [{ chainId: '0x' + (decimalChainId).toString(16) }]);

      const toAddress = this.getRecipientAddress();
      const amountToSend = ethers.utils.parseEther(this.cryptoForm.get('amountControl').value.toString());

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: amountToSend,
      });

      await tx.wait();
      this.snackbarService.open('success');
    } catch (error) {
      this.snackbarService.open('error');
    }
  }

  private getRecipientAddress() {
    let prefix = '0x';
    const address = this.cryptoForm.get('recipientAddressControl').value;

    return address.startsWith(prefix, 0) ? address : prefix.concat(address);
  }
}

