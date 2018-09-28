describe('dashboard.common.confirm-modal', function() {
    'use strict';

    beforeEach(module('app'));

    describe('ConfirmModalService', function() {
        var ConfirmModalService,
            $uibModal,
            modalMock;

        modalMock = {
            result: {
                then: function(resolveCB, rejectCB) {
                    this.resolveCB = resolveCB;
                    this.rejectCB = rejectCB;
                    return this;
                },
                catch: function(rejectCB) {
                    this.rejectCB = rejectCB;
                    return this;
                }
            },
            close: function(data) {
                this.result.resolveCB(data);
            },
            dismiss: function(data) {
                this.result.rejectCB(data);
            }
        };

        beforeEach(inject(function($injector) {
            ConfirmModalService = $injector.get('ConfirmModalService');
            $uibModal = $injector.get('$uibModal');

            spyOn($uibModal, 'open').and.returnValue(modalMock);
        }));

        describe('open', function() {
            it('should open a modal that returns a promise that will be resolved if the user confirms the action', function() {
                ConfirmModalService.open('Test Title', 'Test Body')
                    .then(function(data) {
                        expect(data).toBe('Resolved');
                    })
                    .catch(function(data) {
                        throw Error();
                    });

                modalMock.close('Resolved');
            });

            it('should open a modal that returns a promise that will be rejected if the user dismisses the action', function() {
                ConfirmModalService.open('Test Title', 'Test Body')
                    .then(function(data) {
                        throw Error();
                    })
                    .catch(function(data) {
                        expect(data).toBe('Rejected');
                    });

                modalMock.dismiss('Rejected');
            });
        });

    });
});
