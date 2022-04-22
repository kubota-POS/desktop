import React, {Component} from 'react';
import {Button, Card} from 'react-bootstrap';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {setOpenToastAction} from '../redux/actions/toast.action';
import {getItems} from '../services/item.service';
import {setInvoiceAction} from '../redux/actions/invoice.action';
import {CustomerComponent} from '../components/sale/customerComponent';
import {SaleVoucherInputComponent} from '../components/sale/saleVoucherInputComponent';
import {SaleVoucherComponent} from '../components/sale/saleVocherComponent';
import {t, zawgyi} from '../utilities/translation.utility';
import {RecentInvoice} from '../components/sale/RecentInvoice';
import {getInvoice} from '../services/invoice.service';
import {SelectedItemDetail} from '../components/sale/SelectedItemDetail';
import {getCustomerList} from '../services/customer.service';
import {
	BsPlusCircle,
	BsPeopleFill,
	BsFillPersonLinesFill,
	BsFillGearFill,
	BsFillFilePersonFill,
	BsBoxArrowInRight
} from 'react-icons/bs';
import {CreateCustomerDialog} from '../components/customer/utilities/CreateCustomerDialog';
import {CustomerAutoCompleteDropDown} from '../components/customer/utilities/CustomerAutoCompleteDropDown';
import {ItemAutoCompleteDropDown} from '../components/sale/utilities/ItemAutoCompleteDropDown';
import {RecentInvoiceDialog} from '../components/invoice/recentInvoicesDidalog';

class SalePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			customer: null,
			customers: [],
			showCreateCustomerButton: false,
			openCreateCustomerDialog: false,
			selectedCustomer: null,
			items: [],
			selectedItem: null,
			requestItems: [],
			suggestions: [],
			total: {sell: 0, buy: 0},

			disableInvoice: false,
			saveInvoice: null,
			openRecentInvoice: false,
			messageBoxTitle: t('sale-invoice'),
			reloadCustomer: false
		};
	}

	async loadingItems() {
		const response = await getItems();

		if (response && response.success === false) {
			nativeApi.messageBox.open({
				title: this.state.messageBoxTitle,
				message: response.message,
				type: messageBoxType.info
			});
			return;
		}

		return this.setState({
			items: response,
			disableInvoice: response.length === 0 ? false : true
		});
	}

	getItemList(item) {
		const delitems = localStorage.setItem('CURRENT_INVOICE', JSON.stringify(item));
		this.setState({
			requestItems: item
		});
	}

	async loadingCustomer() {
		const response = await getCustomerList();

		if (response && response.success === false) {
			nativeApi.messageBox.open({
				title: this.state.messageBoxTitle,
				message: response.message,
				type: messageBoxType.info
			});
			return;
		}

		return this.setState({
			customers: response,
			showCreateCustomerButton: response.length === 0 ? true : false
		});
	}

	async loadingRequestItems() {
		const requestItems = localStorage.getItem('CURRENT_INVOICE')
			? JSON.parse(localStorage.getItem('CURRENT_INVOICE'))
			: [];
		const currentCustomer = localStorage.getItem('CUSTOMER') ? JSON.parse(localStorage.getItem('CUSTOMER')) : null;
		this.setState({
			requestItems: requestItems,
			customer: currentCustomer
		});

		if (requestItems.length > 0) {
			const totalAmounts = requestItems.map(value => value.totalAmount);
			const buyAmounts = requestItems.map(value => value.totalOriginAmount);

			const total = {
				sell: totalAmounts.reduce((a, b) => a + b),
				buy: buyAmounts.reduce((a, b) => a + b)
			};

			this.setState({
				total: total
			});
		}
	}

	async loadingData() {
		await this.loadingItems();
		await this.loadingCustomer();
		await this.loadingRequestItems();
	}

	addItem(item) {
		const {requestItems} = this.state;
		const existItem = requestItems.filter(value => value.code === item.code);

		if (existItem.length > 0) {
			return;
		}

		let updateItems = requestItems;
		updateItems.push(item);

		const totalAmounts = requestItems.map(value => value.totalAmount);
		const buyAmounts = requestItems.map(value => value.totalOriginAmount);

		const total = {
			sell: totalAmounts.reduce((a, b) => a + b),
			buy: buyAmounts.reduce((a, b) => a + b)
		};

		this.setState({
			requestItems: updateItems,
			total: total
		});

		return;
	}

	setCustRefrersh() {
		this.setState({
			customer: null,
			requestItems: []
		});
	}

	getSaveInvoice(e) {
		this.setState({
			saveInvoice: e
		});
	}

	async reloadComponent() {
		await this.loadingRequestItems();
	}

	async componentDidMount() {
		const {history} = this.props;
		await this.loadingData();

		nativeApi.app.navigateTo(url => {
			history.push(url);
		});
	}

	render() {
		const {customer, saveInvoice, selectedItem, openRecentInvoice, reloadCustomer} = this.state;
		const {lang} = this.props.reducer;

		return (
			<div className="container-fluid">
				<div className="row mt-1">
					<div className="col-md-12">
						<Button
							className="btn-primary"
							onClick={() =>
								this.setState({
									openRecentInvoice: !openRecentInvoice
								})}
						>
							{openRecentInvoice ? `${t('close-recent-invoice')}` : `${t('open-recent-invoice')}`}
						</Button>

						{this.state.showCreateCustomerButton && (
							<Button
								className="ms-1"
								onClick={() =>
									this.setState({
										openCreateCustomerDialog: !this.state.openCreateCustomerDialog
									})}
							>
								<BsPlusCircle className="me-1" size={20} />
								<span className={`${zawgyi(lang)}`}> {t('btn-create-customer')} </span>
							</Button>
						)}
					</div>
				</div>

				<div className="row">
					<div className="col-md-12">
						<Card className="mt-1">
							<Card.Header>
								<Card.Title>
									<div className="d-flex flex-row justify-content-between align-items-center">
										<CustomerAutoCompleteDropDown
											dataSource={this.state.customers}
											chooseCustomer={e =>
												this.setState({
													customer: e
												})}
											openCreateDialog={e =>
												this.setState({
													openCreateCustomerDialog: e
												})}
										/>

										<SaleVoucherInputComponent
											dataSource={this.state.items}
											retrive={e => {
												this.addItem(e);
											}}
											selectedItem={e =>
												this.setState({
													selectedItem: e
												})}
										/>
									</div>
								</Card.Title>
							</Card.Header>

							<Card.Body>
								{selectedItem && (
									<SelectedItemDetail
										selectedItem={this.state.selectedItem}
										reloadItem={e => this.loadingItems()}
									/>
								)}

								<div className="d-md-flex flex-column">
									<h3 className={`mb-3 title-default ${zawgyi(lang)}`}> {t('receipt')} </h3>
									<CustomerComponent className="mt-3" dataSource={customer} />
								</div>

								<SaleVoucherComponent
									dataSource={this.state.requestItems}
									total={this.state.total}
									retrive={item => this.getItemList(item)}
									refresh={() => this.setCustRefrersh()}
									// getcustomer={this.state.customer}
									// save={(e) => this.getSaveInvoice(e)}
									// reloadRequestItem={() => this.loadingRequestItems()}
								/>
							</Card.Body>
						</Card>
					</div>
				</div>

				<CreateCustomerDialog
					isOpen={this.state.openCreateCustomerDialog}
					reload={() => this.loadingCustomer()}
					close={e =>
						this.setState({
							openCreateCustomerDialog: e
						})}
				/>

				<RecentInvoiceDialog
					isopen={this.state.openRecentInvoice}
					close={e =>
						this.setState({
							openRecentInvoice: e
						})}
					reload={() => this.reloadComponent()}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	reducer: state
});

const mapDispatchToProps = dispatch => ({
	openToast: (title, message, theme) => dispatch(setOpenToastAction(title, message, theme)),
	setInvoice: data => dispatch(setInvoiceAction(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SalePage));
