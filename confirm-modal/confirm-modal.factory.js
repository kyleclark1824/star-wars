(function() {
    'use strict';

    angular
        .module('dashboard.common.confirm-modal')
        .controller('ConfirmModalController', ConfirmModalController)
        .factory('ConfirmModalService', ConfirmModalService);

    function ConfirmModalService($uibModal, $state) {
        return {
            open: open,
            setFormWatch: setFormWatch
        };

        function open(title, body, actions, cancelAction, submitFunc) {
            var submitActions = _.map(actions, a => {
                if (_.isString(a)) {
                    return {
                        display: a
                    };
                }
                return a;
            });

            return $uibModal.open({
                templateUrl: 'dashboard/common/confirm-modal/confirm-modal.html',
                controller: 'ConfirmModalController',
                controllerAs: 'confirm',
                resolve: {
                    title: function() {
                        return title;
                    },
                    body: function() {
                        return body;
                    },
                    submitActions: function() {
                        return submitActions;
                    },
                    cancelAction: function() {
                        return cancelAction;
                    },
                    submitFunc: function() {
                        return submitFunc;
                    }
                }
            }).result;
        }

        function setFormWatch(scope, what, options = {}) {
            var form = undefined,
                submit = undefined;

            function getForm() {
                var formName = options.formName || 'form';
                return form = form || options.controllerAs ? scope[options.controllerAs][formName] : scope[formName];
            }

            function getSubmitFunction() {
                var submitName = options.submitName || 'submit';
                return submit = submit || options.controllerAs ? scope[options.controllerAs][submitName] : scope[submitName];
            }

            function confirmUnsavedChanges() {
                var modalOptions = [
                    {
                        display: 'Continue',
                        value: 'continue'
                    }
                ];

                if (getForm().$valid) {
                    modalOptions.push({
                        display: 'Save and Continue',
                        value: 'save-and-continue'
                    });
                }

                var message = 'There are unsaved changes';
                if (_.isString(what)) {
                    message += ` to ${what}`;
                }

                return open(
                    'Unsaved Changes',
                    message + '.  Are you sure you want to continue?  Your changes will be lost.',
                    modalOptions,
                    'Cancel'
                );
            }

            // Set the $stateChangeStart handler on the scope.
            // If the action being confirmed is a logout, then allow the action and do not
            // launch the confirm modal.
            var stopFormWatch = scope.$on('$stateChangeStart', function(event, toState, toParams) {
                if (!getForm().$pristine && toState.name !== 'auth.login') {
                    confirmUnsavedChanges()
                        .then(function(action) {

                            function _transition() {
                                getForm().$setPristine();
                                stopFormWatch();
                                $state.go(toState, toParams);
                            }

                            if (action.value !== 'save-and-continue') {
                                _transition();
                                return;
                            }

                            if (!_.isFunction(getSubmitFunction())) {
                                stopFormWatch();
                                throw new Error('Expected there to be a submit(isValid, noStateChange) function on the scope that returns a promise.');
                            }

                            var submitting = getSubmitFunction()(true);

                            if (!submitting) {
                                stopFormWatch();
                                throw new Error('Expected the submit function to return a promise.');
                            }

                            submitting.finally(_transition);
                        });

                    event.preventDefault();
                }
            });

            return stopFormWatch;
        }
    }

    function ConfirmModalController($q, $uibModalInstance, title, body, submitActions, cancelAction, submitFunc) {
        var vm = this;

        vm.submit = submit;

        vm.title = title;
        vm.body = body;
        vm.submitActions = _.isArray(submitActions) && submitActions.length ? submitActions : [{
            display: 'Confirm'
        }];
        vm.cancelAction = cancelAction || 'Cancel';
        vm.getActionIcon = getActionIcon;

        vm.status = undefined;

        initialize();

        function initialize() {
            vm.status = {
                submitting: false
            };
        }

        function submit(action) {
            if (!_.isFunction(submitFunc)) {
                $uibModalInstance.close(action);
                return;
            }

            vm.status.submitting = true;

            var promise = submitFunc(action);

            if (_.isArray(promise)) {
                promise = $q.all(promise);
            }

            promise
                .finally(function() {
                    vm.status.submitting = false;
                    $uibModalInstance.close(promise);
                });
        }

        function getActionIcon(action) {
            action = _.isString(action) ? action : action.display;

            switch(_.lowerCase(action)) {
                case 'enable':
                    return 'glyphicon glyphicon-ok';
                    break;
                case 'disable':
                    return 'glyphicon glyphicon-remove';
                    break;
                case 'save':
                    return 'glyphicon glyphicon-floppy-save';
                    break;
                case 'delete':
                    return 'glyphicon glyphicon-trash';
                    break;
                case 'remove':
                    return 'glyphicon glyphicon-minus';
                    break;
                case 'clear':
                    return 'fa fa-eraser';
                    break;
                case 'reset':
                    return 'fa fa-refresh';
                    break;
                case 'send email':
                    return 'fa fa-envelope';
                    break;
                case 'create':
                    return 'glyphicon glyphicon-plus';
                    break;
                case 'add':
                    return 'glyphicon glyphicon-plus';
                    break;
                default:
                    return '';
            }
        }
    }
})();
